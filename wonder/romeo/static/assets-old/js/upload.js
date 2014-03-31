$(function () {
	var uploadForm = $('#upload-form'),
		metadataForm = $('#metadata-form'),
		status = $('#status'),
		file = $('#file'),
		filename = $('#filename'),
		title = $('#title'),
		accountResourceUrl,
		videoResourceUrl;

	uploadForm.submit(function(e) {
		e.preventDefault();
		uploadForm.hide();
		$.get(accountResourceUrl + '/upload_args')
			.done(function (uploadArgs) {
				var formData = new FormData(),
					uploadPath;
				$.each(uploadArgs.fields, function () {
					formData.append(this.name, this.value);
					if (this.name == 'key') {
						uploadPath = this.value;
					}
				});
				formData.append('file', file[0].files[0]);
				$.ajax({
					url: uploadArgs.action,
					type: 'post',
					data: formData,
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
						filename.val(uploadPath).trigger('change');
						status.hide();
					})
					.fail(function () {
						console.log(arguments);
						status.html('Failed');
					});
			});
	});

	metadataForm.submit(function (e) {
		e.preventDefault();
		$.ajax({
			url: videoResourceUrl || accountResourceUrl + '/videos',
			method: videoResourceUrl ? 'patch' : 'post',
			data: metadataForm.serializeArray()
		})
			.done(function (video) {
				if (video.status == 'processing') {
					// Metadata and uploaded file both set - job done.
					window.location = '../videos';	// FIXME
				} else {
					// Still waiting for video to upload.
					// Ensure subsequent submit updates the same video record.
					videoResourceUrl = video.href;
					metadataForm.find('.btn').addClass('btn-success');
				}
			})
			.fail(function () {
				console.log('fail', arguments);
			});
    });

	filename.change(function () {
		if (videoResourceUrl && filename.val()) {
			console.log('filename.change', videoResourceUrl, filename.val());
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

	$.get('/api').done(function (data) {
		accountResourceUrl = data.account.href;
	});

	$.get('/api/categories').done(function (data) {
		var options = $('#category');
		$.each(data.category.items, function() {
			var og = $('<optgroup/>').attr('label', this.name).appendTo(options);
			$.each(this.sub_categories, function() {
				og.append($('<option/>').val(this.id).text(this.name));
			});
		});
	});
});
