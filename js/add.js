//===============================================================
// サムネイルスライドショー
//===============================================================
$(document).ready(function() {
    // 各 .img-parts を個別に処理
    $('.img-parts').each(function() {
        var $imgParts = $(this);
        var $divs = $imgParts.children('div');
        var divCount = $divs.length;

        // 各 div の幅を計算
        var divWidth = 100 / (divCount * 2);

        // サムネイルの枚数に応じてアニメーション時間と幅を計算
        var animationTime = (divCount / 4) * 20 + 's';
        var slideWidth = (divCount / 4) * 200 + '%';

        // 各 div に幅を設定
        $divs.css({
            'flex': '0 0 ' + divWidth + '%',
            'width': divWidth + '%'
        });

        // .img-parts に animation と width を設定
        $imgParts.css({
            'animation-duration': animationTime,
            'width': slideWidth
        });

        // 初期ロード時に子要素を複製して追加
        $divs.clone().appendTo($imgParts);

        // サムネイルにマウスが乗った時にアニメーションを一時停止
        $imgParts.on('mouseenter', function() {
            $(this).css('animation-play-state', 'paused');
        });

        // サムネイルからマウスが離れた時にアニメーションを再開
        $imgParts.on('mouseleave', function() {
            $(this).css('animation-play-state', 'running');
        });
    });
});

//===============================================================
// スライドショー
//===============================================================
$(function() {
    $('.slide3-parts').each(function() {
        var $this = $(this);
        var slides = $this.find('.slide-parts'); // クラス名を修正
        var slideCount = slides.length;
        var currentIndex = 0;

        // インジケータを表示する要素を取得
        var indicators = $this.find('.slide-indicators'); // クラス名は変更なし

        // スライドの数に応じたインジケータを生成
        for (var i = 0; i < slideCount; i++) {
            indicators.append('<span class="indicator" data-index="' + i + '"></span>');
        }

        // インジケータの初期状態を設定
        var indicatorElements = indicators.find('.indicator');
        indicatorElements.eq(currentIndex).addClass('active');

        // スライドの初期状態を設定
        slides.eq(currentIndex).css('opacity', 1).addClass('active');

        // インジケータをクリックしたときの動作を設定
        indicatorElements.on('click', function() {
            var clickedIndex = $(this).data('index');

            // 現在のスライドと同じ場合は何もしない
            if (clickedIndex === currentIndex) return;

            // スライドの切り替え
            slides.eq(currentIndex).css('opacity', 0).removeClass('active');
            slides.eq(clickedIndex).css('opacity', 1).addClass('active');

            // インジケータの更新
            indicatorElements.eq(currentIndex).removeClass('active');
            indicatorElements.eq(clickedIndex).addClass('active');

            // 現在のスライドを更新
            currentIndex = clickedIndex;
        });

        // 自動スライドのタイマー
        setInterval(function() {
            var nextIndex = (currentIndex + 1) % slideCount;

            // スライドの切り替え
            slides.eq(currentIndex).css('opacity', 0).removeClass('active');
            slides.eq(nextIndex).css('opacity', 1).addClass('active');

            // インジケータの更新
            indicatorElements.eq(currentIndex).removeClass('active');
            indicatorElements.eq(nextIndex).addClass('active');

            currentIndex = nextIndex;
        }, 3000); // 3秒ごとにスライドを切り替える
    });
});
