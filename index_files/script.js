$(document).ready(function () {
    $('.js-select-cat select').change(function () {
        let val = $(this).val();

        $('.category-filter').hide();

        if (val === null) {
            val = new Array();
            val.push('0')
        }

        for (var i in val) {

            if (val[i] == '0') {
                $('.category-filter').show();
                return false;
            }
            $('[data-category="' + val[i] + '"]').show();
            $('.clear-filter').show();
        }
    });
    $('.js-select select, .js-market').change(function () {
        var itemSelected = new Array();
        $('.clear-filter').show();
        if ($(this).attr('name') == 'brand' && false) {
            $('.category-filter').parent().hide();
            $('.category-catalog').find('.js-item').each(function (i, item) {
                $(item).find('img').addClass('disabled')
            })
            let vals = $(this).val();
            if (vals === null) {
                vals = new Array();
                vals.push('0')
            }

            for (var i in vals) {
                let val = vals[i];
                if (parseInt(val) == 0) {
                    $('.category-filter').show();
                    $('.category-catalog').find('.js-item').each(function (i, item) {
                        $(item).find('img').removeClass('disabled');
                    })
                    $('.category-filter').find('.js-item').removeClass('disabled');
                    return false;
                }
                $('[data-category="' + val + '"]').show();
                $('[data-category="' + val + '"]').find('.js-item').each(function (i, item) {
                    $(item).find('img').removeClass('disabled');
                })
            }
        } else {
            $('.items-filter').hide();
            $('.item-img').removeClass('disabled');
            $('.equipment-catalog-item').removeClass('disabled');
            let filter = {};
            filter['location'] = new Array();
            $('.js-select select').each(function (i, item) {
                filter[$(item).attr('name')] = $(item).val();
            })
            $('.js-market input:checked').each(function (i, item) {
                filter[$(item).attr('name')].push($(item).val());
            })

            console.log(filter);
            for (var i in jsFilter) {
                let item = jsFilter[i], find = true;

                for (var code in item) {
                    if (!filter.hasOwnProperty(code))
                        continue;
                    if (filter[code] === null) {
                        filter[code] = new Array();
                        filter[code].push('0')
                    }
                    if (filter[code].length == 0) {
                        filter[code].push('0')
                    }
                    if (!find) {
                        continue;
                    }

                    if (filter[code] !== null) {
                        var result = filter[code].filter(function (v) {
                            return item[code].indexOf(v) !== -1;
                        });
                    }

                    if (filter[code].indexOf('0') >= 0)
                        find = true;
                    else if (result.length > 0)
                        find = true;
                    else
                        find = false;


                }
                if (!find) {
                    $('.items-filter').show();
                    $('.items-filter[data-item="' + i + '"]').hide();
                    $('[data-item="' + i + '"]').addClass('disabled');
                } else {
                    itemSelected.push(i)
                }
            }


            let link = '?pdf=Y&clear_cache=Y';
            for (var i in filter) {
                link += '&' + i + '=' + filter[i].join(',');
            }

            $('#send_pdf').attr('href', link);
        }

        $('.js-item').each(function (i, item) {
            let images = $(item).find('img'), dis = $(item).find('img.disabled');
            $(item).show();
            $(item).removeClass('hide');
            if (images.length == dis.length) {
                $(item).hide();
                $(item).addClass('hide');
            }
        })

        $('.category-catalog.category-filter').each(function (i, item) {
            let images = $(item).find('.js-item'), dis = $(item).find('.js-item.hide'),
                cat = $(item).parent().data('category');
            $('.category-label').show();
            $('[data-category="' + cat + '"]').removeClass('hide');
            $('[data-category="' + cat + '"]').show();
            if (images.length == dis.length) {
                $('[data-category="' + cat + '"]').hide();
                $('[data-category="' + cat + '"]').addClass('hide');
            }
        })

        $('.parent-category').each(function (i, item) {
            let images = $(item).find('.sub-category'), dis = $(item).find('.sub-category.hide');

            $(this).show();
            if (images.length == dis.length) {
                $(this).hide();
            }
        })


        disabledAll(itemSelected, $(this).attr('name'));
    })


    $('.js-clear-filter').click(function () {
        $('.clear-filter').add('hided');
        $('.category-filter').show();
        $('.js-select-cat select').val('0');
        $('.js-select-cat select').trigger('change');
        $('.js-market input').prop('checked', false);
    })

    $('#send_pdf').click(function (e) {
        e.preventDefault();
        showLoader();
        $.ajax({
            url: $(this).attr('href'),
            dateType: 'html',
            success: function (res) {
                let html = $(res).find('body');

                var element = html;
                var opt = {
                    margin: 40,
                    filename: 'pdf.pdf',
                    image: {type: 'jpeg', quality: 0.98},
                    html2canvas: {scale: 1},
                    jsPDF: {unit: 'px', format: [2480, 3760], orientation: 'portrait'},
                    pagebreak: {mode: ['avoid-all'], before: '.beforeClass'},
                };

                // download pdf
                html2pdf().set(opt).from(res).save().then(function () {
                    endLoader();
                });

                // var doc = new jsPDF();
                // var elementHandler = {
                //     '#ignorePDF': function (element, renderer) {
                //         return true;
                //     }
                // };
                // var source = window.document.getElementsByTagName("body")[0];
                // doc.fromHTML(
                //     res,
                //     15,
                //     15,
                //     {
                //         'width': 180,'elementHandlers': elementHandler
                //     });
                //
                // doc.output("dataurlnewwindow");

            }
        })
    })


    function disabledAll(itemSelected, name) {
        $('.js-select select').each(function (i, item) {
            if ($(item).attr('name') == name)
                return;
            $(item).find('option').prop('disabled', true);
        })
        itemSelected.forEach(function (i) {
            let item = jsFilter[i];
            for (var code in item) {
                //   if (code == name)
                //       continue;
                for (var val in item[code]) {
                    console.log(code);
                    $('select[name="' + code + '"]').find('option[value="' + item[code][val] + '"]').prop('disabled', false);
                }
            }
        })

        //$('.js-multiselect select').select2("refresh");
    }
})

$(function () {
    setTimeout(function () {
        $('.js-equipment-slider').each(function () {
            //console.log($(this).find('li:not(.clone)').length);
            if ($(this).find('li:not(.clone)').length <= 1) {
                console.log($(this).find('.flex-direction-nav'));
                $(this).find('.flex-direction-nav').hide();
            }
        })
    }, 500)

    $('#pretty_popup').click(function () {
        let _this = $(this);
        $('.pretty_block').hide();
        $('.pretty_block_off').hide();
        if ($(this).prop('checked')) {
            $('.pretty_block').show();
            $('.pretty_block_off').hide();
        }
        else {
            $('.pretty_block').hide();
            $('.pretty_block_off').show();
        }

        $('.js-item').each(function (i, item) {
            console.log($(item).hasClass('desc-opened'));
            if ($(item).hasClass('desc-opened') && _this.prop('checked')) {
                $(item).find('.js-desc.pretty_block').show();
            } else {
                $(item).find('.js-desc.pretty_block').hide();
            }
        })
    })

    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                //$(lazyImage).fadeOut();
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove("lazy-image");
                imgObserver.unobserve(lazyImage);
                //$(lazyImage).fadeIn();
            }
        })
    });
    const arr = document.querySelectorAll('img.lazy-image')
    arr.forEach((v) => {
        imageObserver.observe(v);
    })
});

/* loader */
function showLoader() {
    if (!window.loadingScreen) {
        window.loadingScreen = new BX.PopupWindow("loading_screen", null, {
            overlay: {backgroundColor: 'white', opacity: '80'},
            events: {
                onAfterPopupShow: BX.delegate(function () {
                    BX.cleanNode(window.loadingScreen.popupContainer);
                    BX.removeClass(window.loadingScreen.popupContainer, 'popup-window');
                    this.loadingScreen.popupContainer.appendChild(
                        BX.create('IMG', {props: {src: "/bitrix/templates/ecatalog/loader.gif"}})
                    );
                    window.loadingScreen.popupContainer.removeAttribute('style');
                    window.loadingScreen.popupContainer.style.display = 'block';
                }, this)
            }
        });
        BX.addClass(window.loadingScreen.popupContainer, 'bx-step-opacity');
    }
    window.loadingScreen.show();
}

function endLoader() {
    if (window.loadingScreen && window.loadingScreen.isShown())
        window.loadingScreen.close();
}