/**
 * Created by Don on 2/4/2015.
 */
$(document).ready(function () {
    var intro = $('#intro');

    function showForm(type) {
        var loginForm = $(type);

        intro.addClass('flow_up')
            .removeClass('flow_down');

        loginForm.addClass('flow_up')
            .removeClass('flow_down');
    }

    function hideForm(type) {
        var loginForm = $(type);

        loginForm.removeClass('flow_up')
            .addClass('flow_down');

    }

    $('#login').click(function (event) {
        showForm('#login_form');

        event.preventDefault();
    });

    $('#register').click(function (event) {
        showForm('#register_form');

        event.preventDefault();
    });

    $('.cancel').click(function (event) {
        if (losses._STATUS_.loading) {
            return false;
        }

        intro.addClass('flow_down')
            .removeClass('flow_up');

        if ($('#login_form').hasClass('flow_up')) {
            hideForm('#login_form');
        } else {
            hideForm('#register_form');
        }

        event.preventDefault();
    });

    $('input[type=checkbox]').on('change', function (event) {
        if (losses._STATUS_.loading) {
            event.preventDefault();
            return false;
        }

        if ($(this).is(":checked"))
            $(this).parent("label").addClass("selected");
        else
            $(this).parent("label").removeClass("selected");
    });

    $('input[type=submit]').click(function (event) {
        if (losses._STATUS_.loading) {
            event.preventDefault();
        }
    });

    $('#login_form form').submit(function (event) {
        losses.loading($(this));
        setTimeout(function () {
            losses.warning('login', 'username', '用户名错误！')
        }, 3000);

        event.preventDefault();
    });

    $('#register_form form').submit(function (event) {
        losses.loading($(this));
        setTimeout(function () {
            losses.actionSuccess('账户注册完成，请检查确认注册邮件之后登陆。');

            //losses.cpSwitch();
        }, 3000);
        event.preventDefault();
    });
    $('.scheckbox').prepend('<i class="icon"></i>')
});

var losses = {
    _ELEMENTS_: {
        header: $('header'),
        indexForms: $('.index_form'),
        inputs: $('input')
    },
    _STATUS_: {
        loading: false
    },
    _CACHE_: {},
    actionSuccess: function (hint) {
        $('.load_spiner').remove();

        hint = hint || "";

        losses._ELEMENTS_.header.append('<i class="icon-ok"><span class="icon_text">' + hint + '</span></i>');

        losses._ELEMENTS_.indexForms.each(function () {
            $(this).removeClass('loading')
                .addClass('finished');
        });

        setTimeout(function () {
            //跳转页面代码在这
            console.log('jump');
        }, 1000);
    },
    actionFailed: function (source, target, reason) {
        losses._STATUS_.loading = false;
        losses._ELEMENTS_.indexForms.each(function () {
            $(this).removeClass('loading');
        });

        if (losses._CACHE_.failedTimeoutEvent) {
            clearTimeout(losses._CACHE_.failedTimeoutEvent);
            losses._CACHE_.failedTimeoutEvent = false;
        }

        $('.icon-spin2').remove();

        losses._ELEMENTS_.header.append('<i class="icon-cancel"></i>');

        losses._CACHE_.failedTimeoutEvent = setTimeout(function () {
            var targetIcon = $('.icon-cancel');
            targetIcon.removeClass('pause')
                .addClass('up');

            setTimeout(function () {
                targetIcon.remove();
            }, 470);
        }, 2000);

        losses.warning(source, target, reason);
    },
    warning: function (source, target, text) {
        var targetHeader = $('header>#' + source + '_form>h2') /*nxt line*/
            , targetWarning = $('header>#' + source + '_form>.warning');

        if (text) {
            targetWarning.html(text);
        }

        if (losses._CACHE_.warningTimeoutEvent) {
            clearTimeout(losses._CACHE_.warningTimeoutEvent);
            losses._CACHE_.warningTimeoutEvent = false;
        }

        targetHeader.slideUp();
        targetWarning.slideDown();

        if (target) {
            var targetElement = $('header>#' + source + '_form input[name=' + target + ']');

            targetElement.addClass('highlight');
        }

        losses._CACHE_.warningTimeoutEvent = setTimeout(function () {
            targetHeader.slideDown();
            targetWarning.slideUp();
            target && targetElement.removeClass('highlight');
        }, 2000);
    },
    cpSwitch: function () {
        var hiddenItem = $('.logo, #intro, .index_form')
            , main = $('#main')
            , waiting = true
            , checkCount = 0
            , intervalEvent;

        hiddenItem.each(function () {
            $(this).addClass('exit');
        });

        main.slideUp(500);
        $('.blank').slideDown(500);

        setTimeout(function () {
            waiting = false;
        }, 500);

        $.get('./cp.html', function (data) {
            intervalEvent = setInterval(function () {
                if (!waiting) {
                    clearInterval(intervalEvent);
                    //跳页
                    /*
                     main.remove();
                     hiddenItem.each(function () {
                     $(this).remove();
                     });

                     $('#custom_style').after('<link type="text/css" id="newStyle" rel="stylesheet" href="styles/cp.css"/>')
                     .after('<link type="text/css" id="temp" rel="stylesheet" href="styles/index2cp.css"/>');

                     (function () {
                     setTimeout(function () {
                     $('link[rel="stylesheet"]').forEach(StyleFix.link);
                     }, 10);

                     document.addEventListener('DOMContentLoaded', StyleFix.process, false);
                     })();

                     function $(expr, con) {
                     return [].slice.call((con || document).querySelectorAll(expr));
                     }


                     var title = /<title>([\s\S]*?)<\/title>/gmi.exec(data)[1]
                     , copyObject = $("body").html()
                     , mainContent = /(<!--24RE9O--->[\s\S]*?<!--J7E0Q2-->)/gmi.exec(data)[1]
                     , headerContent = /(<!--1AF4H7-->[\s\S]*?<!--T72AM2-->)/gmi.exec(data)[1];

                     $('header').append(headerContent)
                     .after(mainContent);
                     $("title").html(title);

                     $('.blank').slideUp(500);

                     setTimeout(function () {
                     $("#highlight,#main").each(function () {
                     $(this).slideDown(500);
                     });

                     $('#temp').remove();
                     }, 100);

                     //history.pushState(copyObject, title, 'cp.html');

                     */
                } else {
                    checkCount++;
                }
            }, 100);

        });
    },
    loading: function (target) {
        var targetForm = target.parent();

        losses._STATUS_.loading = true;

        losses._ELEMENTS_.inputs.each(function () {
            $(this).attr('readonly', 'true');
        });

        targetForm.removeClass('flow_up')
            .addClass('loading');

        losses._ELEMENTS_.header.append('<i class="icon-spin2 animate-spin load_spiner"></i>');
    },
    test: function () {
        losses.actionSuccess('账户注册完成，请检查确认注册邮件之后登陆。');
    }
}