<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <meta name="theme-color" content="#5c00ff">
    <meta name="viewport" content="width=500, width=device-width, initial-scale=1, maximum-scale=1">
    <link type="text/css" rel="stylesheet" href="styles/main.css"/>
    <link type="text/css" rel="stylesheet" id="custom_style" href="styles/index.css"/>
    <script src="scripts/jquery.js"></script>
    <script src="scripts/prefixfree.min.js"></script>
    <title>轨道炮 piu——</title>
</head>
<body>
<header>
    <i class="logo right"></i>
    <nav>
        <i class="highlight"></i>
        <li class="nav_item a"><a href="#">首页</a></li>
        <li class="nav_item b"><a href="#">手册</a></li>
        <li class="nav_item c"><a href="#">动态</a></li>
        <li class="nav_item d"><a href="#">关于</a></li>
    </nav>

    <div id="intro">
        <h1>电磁炮加速计划</h1>

        <p class="subtitle">大声呼喊，世界你好</p>

        <div class="button_group clear">
            <a href="#" id="login">登陆</a>
            <a href="#" id="register">注册</a>
        </div>
    </div>

    <div class="clear index_form" id="login_form">
        <h2>登陆</h2>

        <p class="warning">用户名不存在</p>

        <form>
            <input type="text" placeholder="用户名/Email" name="username"/> <br>
            <input type="password" placeholder="密码" name="password"/> <br>

            <label class="scheckbox"><input type="checkbox" name="save">保存登录状态</label> <br>

            <button class="right" type="submit">登陆</button>
            <button class="cancel right">取消</button>
        </form>
    </div>

    <div class="clear index_form" id="register_form">
        <h2>注册</h2>

        <p class="warning">密码错误</p>

        <form>
            <input type="text" placeholder="用户名" name="username"/> <br>
            <input type="text" placeholder="密码" name="password"/> <br>
            <input type="text" placeholder="邮箱" name="email"/> <br>
            <input type="text" placeholder="优惠码" name="offer"/> <br>

            <p class="info">*数据库中密码使用明文存储，请设置为不常用密码</p>

            <label class="scheckbox">
                <input type="checkbox" name="accept">没读过玩命写的<a href="tos.html">许可协议</a>自愿被肛
            </label> <br>

            <button class="right" type="submit">注册</button>
            <button class="cancel right">取消</button>
        </form>
    </div>
</header>
<section id="main">
    <ul class="spec clear">
        <li class="icon-fast left">
            <div>
                <p class="title">快速</p>

                <p class="intro">优选快速线路，多条途径，多种选择，带你起飞 ヽ(✿ﾟ▽ﾟ)ノ</p>
            </div>
        </li>
        <li class="icon-mp left">
            <div>
                <p class="title">省心</p>

                <p class="intro">你需要的我们已经为您准备好，无须四处约〇 d(`･∀･)b</p>
            </div>
        </li>
        <li class="icon-ways left">
            <div>
                <p class="title">选择</p>

                <p class="intro">多种姿势供您选择，满足多种客户的花样需求 (ﾉ∀`*)</p>
            </div>
        </li>
        <li class="icon-nothing left">
            <div>
                <p class="title">探索</p>

                <p class="intro">我们大家来捉鬼嘿！我们大家来捉鬼！ (*´▽`*)</p>
            </div>
        </li>
    </ul>
</section>
<section class="blank"></section>
<footer>
    <p>&copy; railgun accelerator</p>

    <p>Designed By <a href="https://plus.google.com/u/0/+LossesDon/posts">Losses Don</a></p>
    <script src="scripts/main.js"></script>
    <script src="scripts/index.js"></script>
</footer>
</body>
</html>
