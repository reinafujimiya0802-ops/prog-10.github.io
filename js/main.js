//===============================================================
// debounce関数
//===============================================================
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


//===============================================================
// メニュー関連
//===============================================================

// 変数でセレクタを管理
var $menubar = $('#menubar');
var $menubarHdr = $('#menubar_hdr');
var $headerNav = $('header nav');

// menu
$(window).on("load resize", debounce(function() {
    if(window.innerWidth < 9999) {	// ここがブレイクポイント指定箇所です
        // 小さな端末用の処理
        $('body').addClass('small-screen').removeClass('large-screen');
        $menubar.addClass('display-none').removeClass('display-block');
        $menubarHdr.removeClass('display-none ham').addClass('display-block');
    } else {
        // 大きな端末用の処理
        $('body').addClass('large-screen').removeClass('small-screen');
        $menubar.addClass('display-block').removeClass('display-none');
        $menubarHdr.removeClass('display-block').addClass('display-none');

        // ドロップダウンメニューが開いていれば、それを閉じる
        $('.ddmenu_parent > ul').hide();
    }
}, 10));

$(function() {

    // ハンバーガーメニューをクリックした際の処理
    $menubarHdr.click(function() {
        $(this).toggleClass('ham');
        if ($(this).hasClass('ham')) {
            $menubar.addClass('display-block');
        } else {
            $menubar.removeClass('display-block');
        }
    });

    // アンカーリンクの場合にメニューを閉じる処理
    $menubar.find('a[href*="#"]').click(function() {
        $menubar.removeClass('display-block');
        $menubarHdr.removeClass('ham');
    });

    // ドロップダウンの親liタグ（空のリンクを持つaタグのデフォルト動作を防止）
	$menubar.find('a[href=""]').click(function() {
		return false;
	});
	$headerNav.find('a[href=""]').click(function() {
		return false;
	});

	// ドロップダウンメニューの処理
    $menubar.find('li:has(ul)').addClass('ddmenu_parent');
    $('.ddmenu_parent > a').addClass('ddmenu');
    $headerNav.find('li:has(ul)').addClass('ddmenu_parent');
    $('.ddmenu_parent > a').addClass('ddmenu');

// タッチ開始位置を格納する変数
var touchStartY = 0;

// タッチデバイス用
$('.ddmenu').on('touchstart', function(e) {
    // タッチ開始位置を記録
    touchStartY = e.originalEvent.touches[0].clientY;
}).on('touchend', function(e) {
    // タッチ終了時の位置を取得
    var touchEndY = e.originalEvent.changedTouches[0].clientY;
    
    // タッチ開始位置とタッチ終了位置の差分を計算
    var touchDifference = touchStartY - touchEndY;
    
    // スクロール動作でない（差分が小さい）場合にのみドロップダウンを制御
    if (Math.abs(touchDifference) < 10) { // 10px以下の移動ならタップとみなす
        var $nextUl = $(this).next('ul');
        if ($nextUl.is(':visible')) {
            $nextUl.stop().hide();
        } else {
            $nextUl.stop().show();
        }
        $('.ddmenu').not(this).next('ul').hide();
        return false; // ドロップダウンのリンクがフォローされるのを防ぐ
    }
});

    //PC用
    $('.ddmenu_parent').hover(function() {
        $(this).children('ul').stop().show();
    }, function() {
        $(this).children('ul').stop().hide();
    });

    // ドロップダウンをページ内リンクで使った場合に、ドロップダウンを閉じる
    $('.ddmenu_parent ul a').click(function() {
        $('.ddmenu_parent > ul').hide();
    });

});


//===============================================================
// 小さなメニューが開いている際のみ、body要素のスクロールを禁止。
//===============================================================
$(document).ready(function() {
  function toggleBodyScroll() {
    // 条件をチェック
    if ($('#menubar_hdr').hasClass('ham') && !$('#menubar_hdr').hasClass('display-none')) {
      // #menubar_hdr が 'ham' クラスを持ち、かつ 'display-none' クラスを持たない場合、スクロールを禁止
      $('body').css({
        overflow: 'hidden',
        height: '100%'
      });
    } else {
      // その他の場合、スクロールを再び可能に
      $('body').css({
        overflow: '',
        height: ''
      });
    }
  }

  // 初期ロード時にチェックを実行
  toggleBodyScroll();

  // クラスが動的に変更されることを想定して、MutationObserverを使用
  const observer = new MutationObserver(toggleBodyScroll);
  observer.observe(document.getElementById('menubar_hdr'), { attributes: true, attributeFilter: ['class'] });
});


//===============================================================
// スムーススクロール（※バージョン2024-1）※通常タイプ
//===============================================================
$(function() {
    // ページ上部へ戻るボタンのセレクター
    var topButton = $('.pagetop');
    // ページトップボタン表示用のクラス名
    var scrollShow = 'pagetop-show';

    // スムーススクロールを実行する関数
    // targetにはスクロール先の要素のセレクターまたは'#'（ページトップ）を指定
    function smoothScroll(target) {
        // スクロール先の位置を計算（ページトップの場合は0、それ以外は要素の位置）
        var scrollTo = target === '#' ? 0 : $(target).offset().top;
        // アニメーションでスムーススクロールを実行
        $('html, body').animate({scrollTop: scrollTo}, 500);
    }

    // ページ内リンクとページトップへ戻るボタンにクリックイベントを設定
    $('a[href^="#"], .pagetop').click(function(e) {
        e.preventDefault(); // デフォルトのアンカー動作をキャンセル
        var id = $(this).attr('href') || '#'; // クリックされた要素のhref属性を取得、なければ'#'
        smoothScroll(id); // スムーススクロールを実行
    });

    // スクロールに応じてページトップボタンの表示/非表示を切り替え
    $(topButton).hide(); // 初期状態ではボタンを隠す
    $(window).scroll(function() {
        if($(this).scrollTop() >= 300) { // スクロール位置が300pxを超えたら
            $(topButton).fadeIn().addClass(scrollShow); // ボタンを表示
        } else {
            $(topButton).fadeOut().removeClass(scrollShow); // それ以外では非表示
        }
    });

    // ページロード時にURLのハッシュが存在する場合の処理
    if(window.location.hash) {
        // ページの最上部に即時スクロールする
        $('html, body').scrollTop(0);
        // 少し遅延させてからスムーススクロールを実行
        setTimeout(function() {
            smoothScroll(window.location.hash);
        }, 10);
    }
});


//===============================================================
// 汎用開閉処理
//===============================================================
$(function() {
	$('.openclose').next().hide();
	$('.openclose').click(function() {
		$(this).next().slideToggle();
		$('.openclose').not(this).next().slideUp();
	});
});


//===============================================================
// テキストのフェードイン効果
//===============================================================
$(function() {
    $('.fade-in-text').on('inview', function(event, isInView) {
        // この要素が既にアニメーションされたかどうかを確認
        if (isInView && !$(this).data('animated')) {
            // アニメーションがまだ実行されていない場合
            let innerHTML = '';
            const text = $(this).text();
            $(this).text('');

            for (let i = 0; i < text.length; i++) {
                innerHTML += `<span class="char" style="animation-delay: ${i * 0.1}s;">${text[i]}</span>`;
            }

            $(this).html(innerHTML).css('visibility', 'visible');
            // アニメーションが実行されたことをマーク
            $(this).data('animated', true);
        }
    });
});


//===============================================================
// 背景切り替え
//===============================================================
$(document).ready(function () {
  function checkVisibility() {
    const viewportHeight = $(window).height();
    const scrollTop = $(window).scrollTop();

    $(".section").each(function () {
      const sectionTop = $(this).offset().top;
      const sectionHeight = $(this).outerHeight();

      if (
        sectionTop < scrollTop + viewportHeight * 0.6 &&
        sectionTop + sectionHeight > scrollTop + viewportHeight * 0.4
      ) {
        $(this).addClass("active").removeClass("inactive");

        // セクションのIDを取得
        var sectionId = $(this).attr("id");

        // すべてのメニュー項目からactiveクラスを削除
        $("#header-menu li").removeClass("active");

        // 対応するメニュー項目にactiveクラスを追加
        $('#header-menu li a[href="#' + sectionId + '"]')
          .parent()
          .addClass("active");
      } else {
        $(this).addClass("inactive").removeClass("active");
      }
    });
  }

  $(window).on("scroll", checkVisibility);
  checkVisibility();
});


//===============================================================
// 横スライドインタイプのスライドショー
//===============================================================
$(function() {
    $('.slide5').each(function() {
        var $this = $(this);
        var slides = $this.find('.slide');
        var slideCount = slides.length;
        var currentIndex = 0;
        var isAnimating = false;

        // インジケータを表示する要素を取得
        var indicators = $this.find('.slide-indicators');

        // スライドの数に応じたインジケータを生成
        for (var i = 0; i < slideCount; i++) {
            indicators.append('<span class="indicator" data-index="' + i + '"></span>');
        }

        // インジケータの初期状態を設定
        var indicatorElements = indicators.find('.indicator');
        indicatorElements.eq(currentIndex).addClass('active');

        // 初期状態で全てのスライドに .hidden クラスを追加
        slides.addClass('hidden');

        // 最初のスライドに .active と .initial クラスを追加し、.hidden クラスを削除
        slides.eq(currentIndex).addClass('active initial').removeClass('hidden');

        // 遅延後に .initial クラスを削除
        setTimeout(function() {
            slides.eq(currentIndex).removeClass('initial');
        }, 50);

        // インジケータをクリックしたときの動作を設定
        indicatorElements.on('click', function() {
            var clickedIndex = $(this).data('index');

            // アニメーション中は操作を受け付けない
            if (isAnimating) return;

            // 現在のスライドと同じ場合は何もしない
            if (clickedIndex === currentIndex) return;

            // スライドの切り替え
            changeSlide(clickedIndex);
        });

        // 自動スライドのタイマー
        setInterval(function() {
            var nextIndex = (currentIndex + 1) % slideCount;
            changeSlide(nextIndex);
        }, 4000); // 4秒ごとにスライドを切り替える

        function changeSlide(nextIndex) {
            isAnimating = true;

            // 現在のスライドを左に移動
            slides.eq(currentIndex).removeClass('active').addClass('left');

            // 次のスライドを表示
            slides.eq(nextIndex).addClass('active').removeClass('hidden');

            // インジケータの更新
            indicatorElements.eq(currentIndex).removeClass('active');
            indicatorElements.eq(nextIndex).addClass('active');

            // アニメーション終了後の処理
            setTimeout(function() {
                // 左に移動したスライドに .hidden クラスを追加
                slides.eq(currentIndex).removeClass('left').addClass('hidden');

                currentIndex = nextIndex;
                isAnimating = false;
            }, 700); // cssの「.slide5 .slide」の行の時間と合わせる
        }
    });
});


//===============================================================
// サムネイルスライドショー
//===============================================================
$(document).ready(function() {
    $('.slide-thumbnail1 .img').each(function() {
        var $imgParts = $(this);
        var $divs = $imgParts.children('div');
        var divCount = $divs.length;

        // 各 div の幅を計算
        var divWidth = 100 / (divCount * 2);

        // 基準値と速度係数を定義
        var baseAnimationTime = 10; // 「10がアニメーションの速度。小さいと早く、大きいとゆっくりになります。
        var baseSlideWidth = 200;
        var speedFactor = divCount / 2;	// 画面内に表示させる枚数。２枚。

        // アニメーション時間とスライド幅を計算
        var animationTime = (baseAnimationTime * speedFactor) + 's';
        var slideWidth = (baseSlideWidth * speedFactor) + '%';

        // 各 div に幅を設定
        $divs.css({
            'flex': '0 0 ' + divWidth + '%',
            'width': divWidth + '%'
        });

        // .img に animation と width を設定
        $imgParts.css({
            'animation-duration': animationTime,
            'width': slideWidth
        });

        // 子要素を複製して追加
        $divs.clone().appendTo($imgParts);

        // アニメーションの一時停止と再開
        $imgParts.on('mouseenter', function() {
            $(this).css('animation-play-state', 'paused');
        });
        $imgParts.on('mouseleave', function() {
            $(this).css('animation-play-state', 'running');
        });
    });
});
