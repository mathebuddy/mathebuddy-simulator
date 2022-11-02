import json
import os
import glob
import http.server
import socketserver

port = 8314

root = '../mathebuddy-public-courses/'
if os.path.exists(root) == False:
  print('ERROR: you have to git-clone https://github.com/mathebuddy/mathebuddy-public-courses next to this repository')
  exit(-1)

compiler_dir = '../mathebuddy-compiler/'
if os.path.exists(root) == False:
  print('ERROR: you have to git-clone https://github.com/mathebuddy/mathebuddy-compiler next to this repository')
  exit(-1)

def getFiles():
  g = sorted(glob.glob(root + '**/*.mbl'))
  #for file_path in g:
  #  print(file_path)
  return '##'.join(g)


class Handler(http.server.BaseHTTPRequestHandler):
  def do_GET(self):

    print(self.path)

    if self.path == '/__FILES__':
      files = getFiles()
      self.send_response(200)
      self.send_header("Content-type", "text/plain")
      self.wfile.write(bytes(files, "utf-8"))
      return

    # handle get file requests
    p = self.path
    if p.startswith('/mathebuddy-public-courses'):
      p = '..' + p
    elif p.startswith('/'):
      p = p[1:]
    if p == '':
      p = 'index.html'
    self.send_response(200)
    binary = False
    if p.endswith('.html'):
      self.send_header("Content-type", "text/html")
    elif p.endswith('.js'):
      self.send_header("Content-type", "application/javascript")
    elif p.endswith('.jpg') or p.endswith('.jpeg'):
      self.send_header("Content-type", "image/jpeg")
      binary = True
    elif p.endswith('.png'):
      self.send_header("Content-type", "image/png")
      binary = True
    elif p.endswith('.gif'):
      self.send_header("Content-type", "image/gif")
      binary = True
    elif p.endswith('.css'):
      self.send_header("Content-type", "text/css")
    elif p.endswith('.mbl'):
      self.send_header("Content-type", "text/plain")
    elif p.endswith('.hex') or p.endswith('.woff2'):
      self.send_header("Content-type", "application/octet-stream")
      binary = True
    else:
      print('server.py does not support file type of "' + p + '"')
      exit(-1)
    self.end_headers()
    if binary:
      f = open(p, 'rb')
      contents = f.read()
      self.wfile.write(bytes(contents))
    else:
      f = open(p, 'r')
      contents = f.read()
      self.wfile.write(bytes(contents, "utf-8"))

  #def do_POST(self):
  #  print('post')
  #  pass

  def do_TEST(self):
    print('test')


print("mathe-buddy-simulator")

for dependency in ['git', 'node', 'python3']:
  res = os.popen('which ' + dependency).read()
  if len(res) == 0:
    print('ERROR: missing dependency "' + dependency + '"')
    print('>> on Debian-based Linux run "sudo apt install ' + dependency + '"')
    print('>> on macOS install homebrew https://brew.sh and then run "brew install ' + dependency + '"')
    exit(-1)

# REPL
while(True):
  print("")
  print("Choose an option and press [ENTER]:")
  print("[1] update")
  print("[2] start web server at http://localhost:" + str(port) + " Stop with shortcut [CTRL]+[C] or [CMD]+[C]")
  print("[3] kill process at port " + str(port))
  print("[4] exit")
  choice = input()
  if choice == "1":
    os.system("git pull") # TODO: same for compiler!
    os.system("npm install")
    os.system("npm run build")
  elif choice == "2":
    # os.system("python3 -m http.server " + str(port))
    handlerClass = Handler #http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), handlerClass) as httpd:
      print('... started server at http://localhost:' + str(port))
      httpd.serve_forever()
  elif choice == "3":
    # TODO!
    pass
  elif choice == "4":
    exit(0)
  else:
    print('ERROR: invalid choice!!')
