require 'sinatra'
require 'sinatra/cross_origin'
require 'json'

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
    204
end

#注册
post '/auth' do
    user = JSON.parse request.body.read
    if user["name"] == 'zh99998'
        [403, '{"status":"error","error":"fields","fields":{"name":"taken","code":"invalid"}}']
    else
        204
    end
end

#修改账号信息
put '/auth' do
    204
end
#(特别: 修改密码)
put '/password' do
    204
end

#删除账号
delete '/auth' do
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