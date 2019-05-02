from http.server import HTTPServer, BaseHTTPRequestHandler
# from rp import *
from io import BytesIO
def stringHash(x):
    import base64
    return base64.b64encode(int(abs(hash(x))**.5).to_bytes(8,'little')[:3]).decode().lower()

def text_file_to_string(file_path): return open(file_path,'br').read()
def string_to_text_file(file_path,string): 
    file=open(file_path,"w")
    try: file.write(string)
    except:
        file=open(file_path,"w",encoding='utf-8')    
        file.write(string,)
    file.close()
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        prefix='.' if self.path.startswith('/saves') else '../build'
        try:out=text_file_to_string(prefix+self.path)
        except Exception as e:out=b'';print("ERROR: "+str(e))#print_stack_trace(e)
        self.send_response(200 if out else 404)
    # file=open(file_path,"r")
        self.end_headers()
        self.wfile.write(out)#Giant security hole. Don't care. Use a VM. 

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        self.send_response(200)
        self.end_headers()
        filename=str(stringHash(body))
        # with open('./saves/'+filename,'w+') as file:file.write(body)
        string_to_text_file('./saves/'+filename,body.decode())
        response = BytesIO()
        response.write(filename.encode())
        # response.write(b'This is POST request. ')
        # response.write(b'Received: ')
        # response.write(body)
        self.wfile.write(response.getvalue())


httpd = HTTPServer(('localhost', 8015), SimpleHTTPRequestHandler)
httpd.serve_forever()

# from http.server import HTTPServer, BaseHTTPRequestHandler
# # from rp import *
# from io import BytesIO
# def stringHash(x):
#     import base64
#     return base64.b64encode(int(abs(hash(x))**.5).to_bytes(8,'little')[:3]).decode().lower()
#
# def text_file_to_string(file_path): return open(file_path).read()
# def string_to_text_file(file_path,string): 
#     file=open(file_path,"w")
#     try: file.write(string)
#     except:
#         file=open(file_path,"w",encoding='utf-8')    
#         file.write(string,)
#     file.close()
# class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
#
#     def do_GET(self):
#         prefix='.' if self.path.startswith('/saves') else '../build'
#         try:out=text_file_to_string(prefix+self.path).encode()
#         except Exception as e:out=b'';print_stack_trace(e)
#         self.send_response(200 if out else 404)
#     # file=open(file_path,"r")
#         self.end_headers()
#         self.wfile.write(out)#Giant security hole. Don't care. Use a VM. 
#
#     def do_POST(self):
#         content_length = int(self.headers['Content-Length'])
#         body = self.rfile.read(content_length)
#         self.send_response(200)
#         self.end_headers()
#         filename=str(stringHash(body))
#         # with open('./saves/'+filename,'w+') as file:file.write(body)
#         string_to_text_file('./saves/'+filename,body.decode())
#         response = BytesIO()
#         response.write(filename.encode())
#         # response.write(b'This is POST request. ')
#         # response.write(b'Received: ')
#         # response.write(body)
#         self.wfile.write(response.getvalue())
#
#
# httpd = HTTPServer(('localhost', 8015), SimpleHTTPRequestHandler)
# httpd.serve_forever()
#
