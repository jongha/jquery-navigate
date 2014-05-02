//from https://gist.github.com/db/966388
(function addXhrProgressEvent($) {
    var originalXhr = $.ajaxSettings.xhr;
    $.ajaxSetup({
        xhr: function() {
            var req = originalXhr(), that = this;
            if (req) {
                if (typeof req.addEventListener === "function" && that.progress !== undefined) {
                    req.addEventListener("progress", function(evt) {
                        that.progress(evt);
                    }, false);
                }
                if (typeof req.upload === "object" && that.progressUpload !== undefined) {
                    req.upload.addEventListener("progress", function(evt) {
                        that.progressUpload(evt);
                    }, false);
                }
            }
            return req;
        }
    });
})(jQuery);

(function($) {
    $.fn.navigate = function(options) {
        if(options && typeof(options) === "string") {
            options = { "url": options };
        }

        var settings = $.extend({
            "height": "3px",
            "backgroundColor": "red",
            "min": 0,
            "max": 100,
            "position": "absolute",
            "top": 0,
            "left": 0,
            "id": "_navigation_id"
        }, options);

        options = $.extend(settings, options);

        var progressbar = $("#" + options.id);
        if(progressbar.length) { progressbar.remove(); }

        progressbar = $("<div></div>").css({
            "height": options.height,
            "background-color": options.backgroundColor,
            "width": options.min + "%",
            "position": options.position,
            "top": options.top,
            "left": options.left
        }).attr({ "id": options.id });

        $("body").append(progressbar);

        $.ajax({
            url: options.url,
            data: {},
            success: function(data) {
                progressbar.animate({ "width": "100%" }, 400, function() {
                    $(this).remove();

                    $("html").html(data);
                    window.history.pushState(options, "Navition to " + options.url, options.url);
                });
            },
            fail: function() {
                progressbar.remove();
            },
            progress: function(evt) {
                if(evt.lengthComputable) {
                    progressbar.animate({ "width": evt.loaded / evt.total * 100 + "%" });
                }else {
                    var percent = Math.min(50, evt.loaded / 204800 * 100);
                    progressbar.animate({ "width": percent + "%" });
                }
            }
        });
    };
}(jQuery));

