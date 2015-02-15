require 'sinatra'
require 'sinatra/cross_origin'
require 'sinatra/cookies'
require 'sinatra/json'

set :bind, '0.0.0.0'
set :port, 45678

#允许CORS，方便本机调试
configure do
  enable :cross_origin
end
not_found do
  204
end
set :allow_headers, ['*', 'Accept', 'Content-Type', 'If-Modified-Since']

#检查注册 (?name=zh99998)
get '/auth' do
    if params["name"]
      if params["name"] == 'zh99998'
        [403, json(error: 'taken')]
      else
        204
      end
    elsif params["email"]
      if params["email"] == 'zh99998@gmail.com'
        [403, json(error: 'taken')]
      else
        204
      end
    elsif params["code"]
      if params["code"] == 'zzz'
        204
      else
        [403, json(error: 'invalid')]
      end
    else
      400
    end
end

#注册
post '/auth' do
    user = JSON.parse request.body.read
    if user["name"] == 'zh99998'
        [403, json(error: 'fields', fields: {name: 'taken', code: 'invalid'})]
    else
        cookies[:token] = 'zh'
        json name: 'zh99998', email: 'zh99998@gmail.com', email_verified: false, access: {http: {host: "a.lv5.ac", port: 58888, pac:"" }}
        '{"name":"zh99998","email":"zh99998@gmail.com","":false,"access":{"http":{"host":"a.lv5.ac","port":"58888","pac":"http://p.lv5.ac/12345","status":"unavailable"}, "vpn":{"host":"b.lv5.ac","address":"111.111.111.111","psk":"railgun","username":"zh99998","password":"12345","dns":"111.111.111.111","status":"unavailable"}}}'
    end
end

#修改账号信息
put '/auth' do
    cookies[:foo] = 'bar';
    [403, json(foo: 'bar')]
end
#(特别: 修改密码)
put '/password' do
    204
end

#删除账号
delete '/auth' do
    204
end

get '/sign_in' do
    if cookies[:token] == 'zh'
        '{"name":"zh99998","email":"zh99998@gmail.com","email_verified":true,"access":{"http":{"host":"a.lv5.ac","port":"58888","pac":"http://p.lv5.ac/12345","status":"unavailable"}, "vpn":{"host":"b.lv5.ac","address":"111.111.111.111","psk":"railgun","username":"zh99998","password":"12345","dns":"111.111.111.111","status":"unavailable"}}}'
    else
        [403, '{"error":"auth"}']
    end
end

put '/sign_in' do
    user = JSON.parse request.body.read
    if (user["name"] == 'zh99998' or user["name"] == 'zh99998@gmail.com') and user["password"] == 'test'
        cookies[:token] = 'zh'
        '{"name":"zh99998","email":"zh99998@gmail.com","email_verified":false,"access":{"http":{"host":"a.lv5.ac","port":"58888","pac":"http://p.lv5.ac/12345","status":"unavailable"}, "vpn":{"host":"b.lv5.ac","address":"111.111.111.111","psk":"railgun","username":"zh99998","password":"12345","dns":"111.111.111.111","status":"unavailable"}}}'
    else
        [403, '{"error":"auth"}']
    end
end

delete '/sign_in' do
    cookies[:token] = nil
    204
end

#请求发送找回密码邮件
post '/password_reset' do
    204
end

#找回密码
put '/password_reset' do
    204
end

#请求重发认证邮件
post '/email_verify' do
    204
end

#邮箱认证
put '/email_verify' do
    204
end