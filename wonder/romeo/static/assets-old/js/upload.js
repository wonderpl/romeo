$(function () {
	var uploadForm = $('#upload-form'),
		metadataForm = $('#metadata-form'),
		status = $('#status'),
		file = $('#file'),
		videoid = $('#videoid'),
		filename = $('#filename'),
		title = $('#title');

	uploadForm.submit(function(e) {
		e.preventDefault();
		uploadForm.hide();
		$.ajax({
			url: uploadForm.attr('action'),
			type: 'post',
			data: new FormData(this),
			processData: false,
			mimeType: 'multipart/form-data',
			contentType: false,
			xhr: function () {
				var xhr = $.ajaxSettings.xhr();
				xhr.upload.onprogress = function (e) {
					var p = e.lengthComputable ? Math.round(e.loaded * 100 / e.total) : 0;
					status.html(p ? p.toString() + '%' : '');
				};
				return xhr;
			}
		})
			.done(function () {
				// Set metadata form filename field to mark that upload is complete
				filename.val(file.val()).trigger('change');
				status.hide();
			})
			.fail(function () {
				console.log(arguments);
				status.html('Failed');
			});
	});

	metadataForm.submit(function (e) {
		e.preventDefault();
		$.post(metadataForm.attr('action'), metadataForm.serializeArray())
			.done(function (data) {
				if (data.status == 'processing') {
					// Metadata and uploaded file both set - job done.
					window.location = '../videos';	// FIXME
				} else {
					// Still waiting for video to upload.
					// Ensure next subsequent submit updates the same video record.
					videoid.val(data.id);
					metadataForm.find('.btn').addClass('btn-success');
				}
			})
			.fail(function () {
				console.log('fail', arguments);
			});
    });

	filename.change(function () {
		if (videoid.val() && filename.val()) {
			metadataForm.submit();
		} else {
			metadataForm.find('.btn').val('Complete').addClass('btn-primary');
		}
	});

	// Set filename as title placeholder
	file.change(function () {
		if (!title.val()) {
			title.val(this.value);
		}
	});
});
