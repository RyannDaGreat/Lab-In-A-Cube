


# This file contains the WSGI configuration required to serve up your
# web application at http://OneOverZero.pythonanywhere.com/
# It works by setting the variable 'application' to a WSGI handler of some
# description.
#

# +++++++++++ GENERAL DEBUGGING TIPS +++++++++++
# getting imports and sys.path right can be fiddly!
# We've tried to collect some general tips here:
# https://help.pythonanywhere.com/pages/DebuggingImportError


# +++++++++++ HELLO WORLD +++++++++++
# A little pure-wsgi hello world we've cooked up, just
# to prove everything works.  You should delete this
# code to get your own working.

def stringHash(x):
    #Return a four-character string where x is some hashable
    import base64
    return base64.b64encode(int(abs(hash(x))**.5).to_bytes(8,'little')[:3]).decode().lower()
def string_to_text_file(file_path,string):
    file=open(file_path,"w")
    try: file.write(string)
    except:
        file=open(file_path,"w",encoding='utf-8')
        file.write(string,)
    file.close()
def text_file_to_bytes(file_path):
    return open(file_path,'br').read()
def application(environ, start_response):
    def body_length():
        try:return int(environ.get('CONTENT_LENGTH', 0))
        except:return 0
    def is_post():
        return body_length()!=0
    def is_get():
        return not is_post()
    def post_body():
        return environ['wsgi.input'].read(body_length())
    def request_path():
        return environ.get('PATH_INFO')
    path= request_path()
    def get_response(path):
        if path=='/':
            path='/index.html'
        prefix='.' if path.startswith('/saves') else '../build'
        try:
            return text_file_to_bytes(prefix+path)
        except:
            try:
                raise
                return text_file_to_bytes('../build/index.html')
            except Exception as e:
                return b'PYTHON ERROR: '+repr(e).encode()+b'\nPATH: '+prefix.encode()
    def post_response(body):
        try:
            filename=str(stringHash(body))
            string_to_text_file('./saves/'+filename,body.decode())
            return filename.encode()
        except Exception as e:
            return b'PYTHON ERROR: '+repr(e).encode()+b'\BODY: '+body.encode()





    status = '200 OK'
    # content = "JARBLE"
    # import os
    # content+='<br/>'+('got a post request' if is_post() else 'got a get request')
    # content+='<br/>'+('request body =' + repr(post_body()))
    # content+='<br/>'+os.getcwd()
    # content+='<br/>'+'Request path = '+repr(request_path())
    # content+='<br/>'+repr(get_response(path))
    content=get_response(path) if is_get() else post_response(post_body())
    response_headers = [('Content-Type', 'text/html'), ('Content-Length', str(len(content)))] if path.endswith('html') or path=='' else []
    start_response(status, response_headers)
    yield content#.encode('utf8')

