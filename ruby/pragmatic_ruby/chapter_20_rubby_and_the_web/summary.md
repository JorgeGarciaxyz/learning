# Chapter 20

# Writing CGI Scripts

CGI = common gateway interface

You can use ruby to generate HTML output doing something like this

```ruby
print "Content-type: text/html\r\n\r\n"
print "<html><body>Hello World! It's #{Time.now}</body></html>\r\n"
```

Put this in a CGI directory mark it as executable and you'll be able to access it via
your browser.

## 20.2 Using cgi.rb

Class `CGI` provides support for writing CGI scripts. With this you can
- manipulate forms
- cookies
- env
- maintain stateful sessions

### Quoting

When dealing with URLs and HTML code, you must be careful to quote certain characters.
For instance, a slash character ( / ) has special meaning in a URL, so it must be “escaped” if
it’s not part of the path name.

That is, any / in the query portion of the URL will be translated
to the string %2F and must be translated back to a / for you to use it. Space and ampersand
are also special characters. To handle this, CGI provides the routines CGI.escape and CGI.unescape :\

```ruby
require "cgi"
puts CGI.escape("Nicholas Payton/Trumpet & Flugel Horn")
```

produces
Nicholas+Payton%2FTrumpet+%26+Flugel+Horn

### Query parameters

HTTP requests from the browser to your application may contain parameters, either passed
as part of the URL or passed as data embedded in the body of the request.

 (random example about a simple form)

Class CGI gives you access to form data in a couple of ways. First, we can just treat the CGI
object as a hash, indexing it with field names and getting back field values.

```ruby
require "cgi"
cgi = CGI.new
cgi["name"]   # => dave thomas
cgi["reason"] # => flexible
```

We can ask to see them all by using the CGI#params method. The value returned by
params acts like a hash containing the request parameters. You can both read and write this
hash (the latter allows you to modify the data associated with a request). Note that each of
the values in the hash is actually an array.

```ruby
cgi = CGI.new
cgi.params

cgi.params # => contain the hash

# You can use the helper #has_key?

cig.has_key?("name")
```

### HTML with CGI

You can generate HTML using CGI (why? :(((

pls this sucks

```ruby
require "cgi"
cgi = CGI.new("html4")  # add HTML generation methods
cgi.out do
  cgi.html do
    cgi.head do
      cgi.title { "TITLE" }
    end +
    cgi.body do
      cgi.form("ACTION" => "uri") do
        cgi.p do
          cgi.textarea("get_text") +
          cgi.br +
          cgi.submit
        end
      end +
      cgi.pre do
        CGI.escapeHTML(
          "params: #{cgi.params.inspect}\n" +
          "cookies: #{cgi.cookies.inspect}\n" +
          ENV.collect do |key, value|
            "#{key} --> #{value}\n"
          end.join("")
        )
      end
    end
  end
end
```

## 20.3 Templating systems

### Haml

Long time not seeing this old friend.

You can insert haml on ruby scripts like this:

```ruby
require "haml"
engine = Haml::Engine.new(%{
  %body
    #welcome-box
      %p= greeting
    %p meep
})

data = {...}
puts engine.render(nil, data)
```

### Erb

Embedding erb in Your Code

The most common use is to use it as a library in your own code.
(This is what Rails does with its .erb templates.)

```ruby
require "erb"

SOURCE =
%{<% for number in min..max %>
The number is <%= number %>
<% end %>
}

erb = ERB.new(SOURCE)

min = 4
max = 6
puts erb.result(binding)

# produces
# The number is...
```

Notice how we can use local variables within the erb template. This works because we pass
the current binding to the result method. erb can use this binding to make it look as if the
template is being evaluated in the context of the calling code.

## 20.4 Cookies

The Ruby CGI class handles the loading and saving of cookies for you. You can access the
cookies associated with the current request using the CGI#cookies method, and you can set
cookies back into the browser by setting the cookie parameter of CGI#out to reference either
a single cookie or an array of cookies:

```ruby
require "cgi"

COOKIE_NAME = "chocolate chip"

cgi = CGI.new
values = cgi.cookies[COOKIE_NAME]
```

You can also expire them

```ruby
cookie = CGI::Cookie.new(COOKIE_NAME, Time.now.to_s)
cookie.expires = Time.now + 30*24*3600 # 30 days
```

### Sessions

Sessions are handled by class CGI::Session , which uses cookies but provides a
higher-level abstraction.

As with cookies, sessions emulate a hashlike behavior, letting you associate values with
keys. Unlike cookies, sessions store the majority of their data on the server, using the
browser-resident cookie simply as a way of uniquely identifying the server-side data.

Sessions should be closed after use, because this ensures that their data is written out to the
store. When you’ve permanently finished with a session, you should delete it.

```ruby
require "cgi"
require "cgi/session"

cgi = CGI.new("html4")
session = CGI::Session.new(
  cgi, session_key: "rubyweb", prefix: "web-session."
)

count = (sess["accesscount"] || 0).to_i
count += 1
sess["accesscount"] = count
sess["lastaccess"] = Time.now.to_s
sess.close
```

## 20.5 Choice of web servers

So far, we’ve been running Ruby scripts under the Apache web server. However, Ruby
comes bundled with WEBrick, a flexible, pure-Ruby HTTP server toolkit. WEBrick is an
extensible plug-in–based framework that lets you write servers to handle HTTP requests
and responses. The following is a basic HTTP server that serves documents and directory
indexes:

```ruby
require "webrick"
include WEBrick

s = HTTPServer.new(Port: 2000,DocumentRoot: File.join(Dir.pwd, "/html"))

trap("INT") { s.shutdown }

s.start
```

Uses Object#trap to arrange to shut down tidily on interrupts before starting the server running.

WEBrick can do far more than serve static content. You can use it just like a Java servlet
container. The following code mounts a simple servlet at the location /hello . As requests
arrive, the do_GET method is invoked. It uses the response object to display the user agent
information and parameters from the request.

```ruby
require "webrick"

include WEBrick

s = HTTPServer.new(Port: 2000)

class HelloServlet < HTTPServlet::AbstractServlet
  def do_GET(req, res)
    res['Content-Type'] = "text/html"
    res.body = %{
      <html><body>
      <p>Hello. You're calling from a #{req['User-Agent']}</p>
      <p>I see parameters: #{req.query.keys.join(', ')}</p>
      </body></html>
    }
  end
end

s.mount("/hello", HelloServlet)

trap("INT"){ s.shutdown }

s.start
```
