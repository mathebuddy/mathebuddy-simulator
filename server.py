# mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
# (c) 2022 by TH Koeln
# Author: Andreas Schwenk contact@compiler-construction.com
# Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
# License: GPL-3.0-or-later

# this script is a command line tool to install, update
# and run the mathe:buddy-simulator.

import json
import os
import glob
import http.server
import socketserver

port = 8314

print("mathe-buddy-simulator")

for dependency in ['git', 'node', 'python3']:
  res = os.popen('which ' + dependency).read()
  if len(res) == 0:
    print('ERROR: missing dependency "' + dependency + '"')
    print('>> on Debian-based Linux run "sudo apt install ' + dependency + '"')
    print('>> on macOS install homebrew https://brew.sh and then run "brew install ' + dependency + '"')
    exit(-1)


root = '../mathebuddy-public-courses/'
if os.path.exists(root) == False:
  print('ERROR: you have to git-clone https://github.com/mathebuddy/mathebuddy-public-courses next to this repository')
  exit(-1)

compiler_dir = '../mathebuddy-compiler/'
if os.path.exists(root) == False:
  print('ERROR: you have to git-clone https://github.com/mathebuddy/mathebuddy-compiler next to this repository')
  exit(-1)


# handler for web server
class Handler(http.server.BaseHTTPRequestHandler):
  def do_GET(self):
    # return all files in public-courses-repository
    if self.path == '/__FILES__':
      files = '##'.join(sorted(glob.glob(root + '**/*.mbl')))
      self.send_response(200)
      self.send_header("Content-type", "text/plain")
      self.wfile.write(bytes(files, "utf-8"))
      return
    # handler for file requests
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
    elif p.endswith('.svg'):
      self.send_header("Content-type", "image/svg+xml")
    elif p.endswith('.ico'):
      return # ignore!
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

# REPL
while(True):
  print("")
  print("Choose an option and press [ENTER]:")
  print("[1] update")
  print("[2] make playground")
  print("[3] start web server at http://localhost:" + str(port) + " Stop with shortcut [CTRL]+[C] or [CMD]+[C]")
  print("[4] kill web server (emergency option)")
  print("[5] exit")
  choice = input(">> ")
  if choice == "1":
    # ===== UPDATE =====
    os.system("git pull") # TODO: same for compiler!
    os.system("npm install")
    os.system("npm run build")
  elif choice == "2":
    # ===== MAKE PLAYGROUND =====
    pg = "playground/"
    os.system("mkdir -p " + root + pg)
    f = open(root + pg + "hello.mbl", "w")
    f.write("Hello World\n###########\n\nHello world from math buddy!\n")
    f.close()
  elif choice == "3":
    # ===== START WEB SERVER =====
    # os.system("python3 -m http.server " + str(port))
    handlerClass = Handler
    with socketserver.TCPServer(("", port), handlerClass) as httpd:
      print('... started server at http://localhost:' + str(port))
      httpd.serve_forever()
  elif choice == "4":
    # ===== KILL WEB SERVER =====
    res = os.popen('lsof -i :' + str(port)).read()
    if len(res) == 0:
      print("... there is no process listening to port " + str(port))
    else:
      print(res)
      print("The web server is still running.")
      print("The process id of the concerned process is denoted below PID.")
      print("Run 'sudo kill -9 PID' (replace PID) from a terminal window.")
      print("(Tip: The process may terminate automatically; just wait some seconds)")
  elif choice == "5":
    # ===== EXIT =====
    exit(0)
  else:
    # ===== INVALID CHOICE =====
    print('ERROR: invalid choice!!')
