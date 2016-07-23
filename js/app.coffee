i18n =
  status:
    '-1': '禁用', 0: "等待邮箱验证", 1: "余额不足", 2: "正常使用"
  zone:
    h: '中国', j: '亚太', a: '北美'
  monthly_plan:
    1: 'Level 1'
    2: 'Level 2'
    3: 'Level 3'
    4: 'Level 4'
    5: 'Level 5'
  price_plan:
    1: '3'
    3: '2.5'
    4: '2'
    6: '1.5'
  invoice_type:
    1: '充值'
    2: '流量消费'
    3: '套餐消费'
    4: '礼品卡'
    '-1': '充值撤销'
    '-3': '套餐撤销'
  invoice_status:
    0: '待付款'
    1: '已完成'
    2: '已取消'
    3: '等待确认收货'

$('#sign_up').submit (event)->
  event.preventDefault()
  if @password.value == @password_confirm.value
    $.ajax
      url: '/api/user',
      type: 'POST',
      data: JSON.stringify
        username: @username.value
        password: @password.value
        email: @email.value
        refer: @code.value
      dataType: 'json'
      contentType: "application/json; charset=utf-8"
    .done (data, textStatus, jqXHR)->
      store.set('token', data.token)
      alert('注册成功,请查收验证邮件')
      location.href = '/'
    .fail (jqXHR, textStatus, errorThrown)->
      if jqXHR.responseJSON? and jqXHR.responseJSON.code?
        switch jqXHR.responseJSON.code
          when 8
            alert '用户名格式不正确'
          when 9
            alert '用户名已被占用'
          when 10
            alert '邮箱格式不正确'
          when 11
            alert '邮箱已被占用'
          when 15
            alert '邀请码不正确或已过期'
          else
            alert '其他错误1'
      else
        alert '其他错误2'
  else
    alert '两次密码输入不一致'

$('#sign_in').submit (event)->
  event.preventDefault()
  $.ajax
    url: '/api/sign_in',
    type: 'PUT',
    data: JSON.stringify
      username: @username.value
      password: @password.value
    dataType: 'json'
    contentType: "application/json; charset=utf-8"
  .done (data, textStatus, jqXHR)->
    store.set('token', data.token)
    location.href = '/'
  .fail (jqXHR, textStatus, errorThrown)->
    if jqXHR.status == 403
      alert '用户名或密码错误'
    else
      alert '登录失败: 其他错误'

$('#sign_out').click (event)->
  event.preventDefault()
  store.remove('token')
  $('#is_sign_in').hide()
  $('#not_sign_in').show()

$('#password_reset_1').submit (event)->
  event.preventDefault()
  $.ajax
    url: '/api/password_reset',
    type: 'POST'
    data: JSON.stringify
      username: @username.value
      email: @email.value
    contentType: "application/json; charset=utf-8"
  .done (data, textStatus, jqXHR)->
    alert('请查收验证邮件')
  .fail (jqXHR, textStatus, errorThrown)->
    if jqXHR.status == 403
      alert '邮箱与用户名不符'
    else
      alert '其他错误'
$('#password_reset_2').submit (event)->
  event.preventDefault()
  $.ajax
    url: '/api/password_reset',
    type: 'PUT'
    data: JSON.stringify
      code: uri.query(true).code
      password: @password.value
    contentType: "application/json; charset=utf-8"
  .done (data, textStatus, jqXHR)->
    location.href = '/'
  .fail (jqXHR, textStatus, errorThrown)->
    if jqXHR.status == 403
      alert '验证代码错误或已失效'
    else
      alert '其他错误'
$('#change_plan').submit (event)->
  event.preventDefault()
  $.getJSON '/api/sign_in', token: store.get('token')
  .done (data, textStatus, jqXHR)=>
    if data.zone != $("input[name='zone_id']:checked").val()
      $.ajax
        url: "/api/zone?token=#{store.get('token')}",
        type: 'PUT'
        data: JSON.stringify
          zone: $("input[name='zone_id']:checked").val()
        contentType: "application/json; charset=utf-8"
      .done (data, textStatus, jqXHR)=>
        console.log '切换地区成功'
        $.ajax
          url: "/api/plan?token=#{store.get('token')}",
          type: 'POST'
          data: JSON.stringify
            id: $("input[name='plan_id']:checked").val()
          contentType: "application/json; charset=utf-8"
        .done (data, textStatus, jqXHR)->
          console.log '切换套餐成功'
          location.href = '/invoices'
        .fail (jqXHR, textStatus, errorThrown)->
          alert '切换套餐失败, 可能由于余额不足或账号状态异常'
      .fail (jqXHR, textStatus, errorThrown)->
        alert '切换地区失败'
    else
      $.ajax
        url: "/api/plan?token=#{store.get('token')}",
        type: 'POST'
        data: JSON.stringify
          id: $("input[name='plan_id']:checked").val()
        contentType: "application/json; charset=utf-8"
      .done (data, textStatus, jqXHR)->
        console.log '切换套餐成功'
        location.href = '/invoices'
      .fail (jqXHR, textStatus, errorThrown)->
        alert '切换套餐失败, 可能由于余额不足或账号状态异常'
  .fail (jqXHR, textStatus, errorThrown)->
    alert('未知错误1')
$('#pay input[name=payment]').change (event)->
  if $("input[name=payment]:checked").val()
    $('#pay_amount').hide()
    $('#pay_code').show()
  else
    $('#pay_amount').show()
    $('#pay_code').hide()
$('#pay').submit (event)->
  event.preventDefault()
  $('#pay input[type=submit]').prop("disabled", true)
  payment = $("#pay input[name='payment']:checked").val()
  if payment == 'paypal' and parseFloat(@amount.value) < 15
    alert '由于Paypal 会向我们收取高昂的手续费, 我们仅支持单笔 ￥15 ($2.4) 以上的充值金额使用 Paypal 付款.'
    $('#pay input[type=submit]').prop("disabled", false)
    return
  if payment == 'code'
    $.ajax
      url: "/api/code/#{@code.value}?token=#{store.get('token')}",
      type: 'POST'
      contentType: "application/json; charset=utf-8"
    .done (data, textStatus, jqXHR)->
      alert('充值成功')
      location.reload()
    .fail (jqXHR, textStatus, errorThrown)=>
      if jqXHR.status == 403
        alert('礼品卡代码不正确或已过期')
      else
        alert('未知错误1')
      $('#pay input[type=submit]').prop("disabled", false)
  else
    $.ajax
      url: "/api/payment?token=#{store.get('token')}",
      type: 'POST'
      data: JSON.stringify
        amount: parseFloat(@amount.value) * 100
        payment: $("#pay input[name='payment']:checked").val()
      dataType: 'json'
      contentType: "application/json; charset=utf-8"
    .done (data, textStatus, jqXHR)=>
      location.href = data[1]
    .fail (jqXHR, textStatus, errorThrown)=>
      if jqXHR.status == 400
        alert('金额不正确')
      else
        alert('未知错误1')
      $('#pay input[type=submit]').prop("disabled", false)
$('#invoices').on 'click', '.repay', (event)->
  event.preventDefault()
  $.ajax
    url: "https://railgun.ac/api/invoice/#{$(this).attr('data-id')}?token=#{store.get('token')}"
    type: 'PUT'
    dataType: 'json'
    contentType: "application/json; charset=utf-8"
  .done (data, textStatus, jqXHR)->
    location.href = data[1]
  .fail (jqXHR, textStatus, errorThrown)->
    alert '发起付款失败'
$('#change_password').submit (event)->
  event.preventDefault()
  if @password.value == @password_confirm.value
    $.ajax
      url: "/api/user/password?token=#{store.get('token')}",
      type: 'PUT'
      data: JSON.stringify
        password: @old_password.value
        newpassword: @password.value
      contentType: "application/json; charset=utf-8"
    .done (data, textStatus, jqXHR)->
      alert('修改密码成功, 请重新登录')
      location.href = '/'
    .fail (jqXHR, textStatus, errorThrown)->
      if jqXHR.status == 403
        alert '旧密码不正确'
      else
        alert '未知错误1'
  else
    alert('两次密码输入不一致')
$('#resend-email').submit (event)->
  event.preventDefault()
  $.ajax
    url: "/api/email_verify?token=#{store.get('token')}"
    type: 'POST'
    data: JSON.stringify(email: @email.value) if @email.value != $('#resend-email input[name=email]').attr 'data-origin'
    contentType: "application/json; charset=utf-8"
  .done (data, textStatus, jqXHR)->
    alert('请查收验证邮件')
  .fail (jqXHR, textStatus, errorThrown)->
    if jqXHR.status == 409
      alert('邮箱已经被占用')
    else
      alert('未知错误1')
$('#change_sub_password').click (event)->
  event.preventDefault()
  $.getJSON '/api/sign_in', token: store.get('token')
  .done (user, textStatus, jqXHR)->
    $.ajax
      url: "/api/zone?token=#{store.get('token')}",
      type: 'PUT'
      data: JSON.stringify
        zone: user.zone
      contentType: "application/json; charset=utf-8"
    .done (data, textStatus, jqXHR)=>
      alert '服务密码已经重置, 请参照连接说明修改设备上的代理/VPN设置. '
      location.reload()
    .fail (jqXHR, textStatus, errorThrown)->
      alert '未知错误2'
  .fail (jqXHR, textStatus, errorThrown)->
    alert '未知错误1'


uri = new URI();
switch uri.path()
  when '/email_verify'
    $.ajax
      url: '/api/email_verify',
      type: 'PUT'
      data: JSON.stringify
        code: uri.query(true).code
      contentType: "application/json; charset=utf-8"
    .done (data, textStatus, jqXHR)->
      location.href = '/'
    .fail (jqXHR, textStatus, errorThrown)->
      alert '验证邮箱失败'
  when '/password_reset'
    if uri.query(true).code? # password_reset_2
      $('#password_reset_2').show()
    else
      $('#password_reset_1').show()
  when '/invoices'
    $.getJSON '/api/sign_in', token: store.get('token')
    .done (user, textStatus, jqXHR)->
      if user.billing_date?
        $('#billing_date').text user.billing_date
        $('#billing_date_wrapper').show()
      $.getJSON '/api/invoice', token: store.get('token')
      .done (data, textStatus, jqXHR)->
        for invoice in data
          $("<tr><td>#{i18n.invoice_type[invoice.type]}</td><td>#{invoice.amount / 100}</td><td>#{i18n.invoice_status[invoice.status]}</td><td>#{new Date(invoice.generate_time * 1000)}</td><td>#{if invoice.finish_time? then new Date(invoice.finish_time * 1000) else ''}</td><td>#{if invoice.type == 1 and invoice.status == 0 then "<a class=\"repay\" href=\"#\" data-id=\"#{invoice.uuid}\">付款</a>" else if invoice.type == 1 and invoice.status == 3 then "<a class=\"repay\" href=\"https://www.alipay.com\" target=\"_blank\">确认收货</a>" else ''}</td></tr>").appendTo '#invoices'
        for invoice in data when invoice.type == 3 and invoice.status == 0
          payment_value = - (user.traffic_remains + invoice.amount)
          if payment_value > 0
            $('#pay input[name=amount]').val payment_value/100
          break

  when '/plans'
    if store.get('token')
      $.getJSON '/api/plan', token: store.get('token')
      .done (data, textStatus, jqXHR)->
        plans_enabled = [2,3,4,5]
        data.sort (a,b)->if a.id < b.id then -1 else 1
        for plan in data when plan.id in plans_enabled
          $("<label><input name=\"plan_id\" type=\"radio\" value=\"#{plan.id}\">#{plan.name}: ￥#{plan.price/100}/月/#{plan.traffic/1024/1024/1024}GB, 超出流量 ￥#{i18n.price_plan[plan.price_plan]} / GB</label><br/>").appendTo '#plans'
        $('input[name=plan_id][value=2]').prop("checked", true)
      .fail (jqXHR, textStatus, errorThrown)->
        alert '未知错误'
    else
      location.href = '/'
  when '/'
    if store.get('token')
      $.getJSON '/api/sign_in', token: store.get('token')
      .done (user, textStatus, jqXHR)->
        if user.status > 0 and user.next_monthly_plan == 1
          location.href = '/plans'
        else
          $('#username').text user.username
          $('#monthly_plan').text i18n.monthly_plan[user.next_monthly_plan]
          $('#status').text i18n.status[user.status]
          $('#traffic_monthly_used').text (user.traffic_month_used / 1024 ** 3).toFixed(2)
          $('#traffic_monthly_start').text user.traffic_month_start / 1024 ** 3
          $('#credits').text user.traffic_remains / 100
          $('#zone').text i18n.zone[user.zone]

          if user.status == 0
            $('#resend-email input[name=email]').val user.email
            $('#resend-email input[name=email]').attr 'data-origin', user.email
            $('#resend-email').show()
          else
            $('#email_confirmed').show()

          $('#is_sign_in').show()

          if user.status >= 2
            $('#tutorials').show()
            $('.tutorial-button').click (event)->
              event.preventDefault()
              $.get "/tutorials/#{$(this).attr('data-platform')}.md.mustache", (data)->
                template = Hogan.compile(data);
                $('#tutorial').html marked template.render zone: user.zone, address: user.dns_info["#{user.zone}.lv5.ac"], dns_server: {'h':'10.8.0.1', 'a':'10.1.0.1', j:'10.9.0.1'}[user.zone], username: user.username, sub_password: user.sub_password, sub_password_2: parseInt(user.sub_password)+1, sub_password_3: parseInt(user.sub_password)+2, sub_password_4: parseInt(user.sub_password)+3
                if document.getElementById("qrcode")
                  new QRCode document.getElementById("qrcode"), 'ss://' + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse("aes-256-cfb:#{user.username}@#{user.zone}.lv5.ac:#{parseInt(user.sub_password)+3}"))
      .fail (jqXHR, textStatus, errorThrown)->
        $('#not_sign_in').show()
    else
      $('#not_sign_in').show()
