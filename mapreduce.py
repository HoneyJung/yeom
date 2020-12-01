import http.server
from urllib.parse import urlparse
class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path=urlparse(self.path)
        message_parts=['Client address : {0}'.format(self.client_address),
                       'Client string : {0}'.format(self.address_string()),
                       'Command : {0}'.format(self.command),
                       'Path : {0}'.format(self.path),
                       'real path : {0}'.format(parsed_path.path),
                       'query : {0}'.format(parsed_path.query),
                       'request version : {0}'.format(self.request_version),
                       'server_version : {0}'.format(self.server_version),
                       'sys_version : {0}'.format(self.sys_version),
                       'protocol_version : {0}'.format(self.protocol_version)]

        message='<br>'.join(message_parts)
        self.send_response(200) 
        self.end_headers()
        self.wfile.write(message.encode('utf-8'))
        return None

s=http.server.HTTPServer(('localhost',8080),MyHandler)
s.serve_forever()

'''
def master() {
   # create an instance of the HTTP server
   e := echo.New()
   #  add the request handler for the route
   e.GET("/compute", func(c echo.Context) error {
      # retrieve "text" param from query
      text := c.QueryParam("text")

      # 1. Splitting
      # 2. Mapping
      # 3. Shuffling
      # the variable contains the results of the calculations of the Reducers
      var reducing = map[string]map[string]int{}
      
      # 4. Reducing

      # return results in the HTTP response
      return json.NewEncoder(c.Response()).Encode(&reducing)
   })

   # hang the HTTP-server on port
   e.Logger.Fatal(e.Start(":8080"))
}
'''
