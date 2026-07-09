libras = {
	init: function (urlImage, urlVideo, urlMao)
	{
		urlImages = urlImage;
		urlVideos = urlVideo;
		urlHands = urlMao;
		this.getClick();
	},
	getClick: function ()
	{
		// Filter Order
		$('#filter-order a').click(function(e) {
			e.preventDefault();

			$('#filter-order a').removeClass('selected');
			var type = $(this).attr('href').replace('/','');
			if(type == 'alfabeto')
			{
				var result = libras.getWordsByLetter('A');
				if (result.length > 0) {
					libras.setFindType('alfabeto', 'A');
					libras.setValue('palavras', result);
				}
			}
			else if(type == 'assunto')
			{
				var result = libras.getSubjects();
				if (result.length > 0) {
					libras.setFindType('assunto');
					libras.setValue('assunto', result);
				}
			}
			else if(type == 'mao')
			{
				libras.showHandLightbox();
			}
		});

		// by Letter
		$('#filter-letter li a').click(function(e)
		{
			e.preventDefault();
			var result = libras.getWordsByLetter(this.id.slice(-1));
			if(result.length > 0)
			{
				libras.setFindType('alfabeto',this.id.slice(-1));
				libras.setValue('palavras', result);
			}
		});

		// by word
		$('select#input-palavras').change(function(e){
			e.preventDefault();
			var value = $(this).find('option:selected').attr('id');
			if(value > 0)
			{
				var result = libras.getWordById(value);
				if (result !== false) {
					libras.setValue('all', result);
				}
			}
		});

		// by subject
		$('select#input-assunto').change(function(e){
			e.preventDefault();
			var value = $(this).find('option:selected').attr('id');
			if(value > 0)
			{
				var result = libras.getWordsBySubject(value);
				if(result.length > 0)
				{
					libras.setFindType('assunto');
					libras.setValue('palavras', result);
				}
			}
		});

		// by Hand
		$('#container-mao li a').click(function(e)
		{
			e.preventDefault();
			var result = libras.getWordsByHand($(this).attr('href').replace('#mao-', ''));
			if(result.length > 0)
			{
				libras.closeLightbox();
				libras.setFindType('mao');
				libras.setValue('palavras', result);
			}
		});

		// by search
		$('.btn.submit').click(function(e){
			e.preventDefault();
			var type = $(".search input[type='radio']:checked").val();
			var number = $('#search_number').val();
			var search = $('#search_field').val();

			var result = libras.getWordsBySearch(type, search, number);
			if(result.length > 0)
			{
				libras.setFindType('search');
				libras.setValue('search', result);
			}
		});

		$('a.viewLightbox').click(function(e){
			e.preventDefault();
			$('#container-'+$(this).attr('href').replace('#','')).css('display', 'block');
			$('#bg-splash').css('display', 'block');
		});

		$('a.close').click(function(e){
			e.preventDefault();
			libras.closeLightbox();
		});

	},
	resetAll: function()
	{
		this.inputReset();
		this.resetAlfabeto();
		this.resetSubject();
	},
	inputReset: function()
	{
		$('#filter-letter a').removeClass('selected');
		$('.input-text').text('');
	},
	resetAlfabeto: function()
	{
		$('#input-palavras > option').remove();
	},
	resetSubject: function()
	{
		$('#input-assunto > option').remove();
	},
	setFindType: function(type, addicional)
	{
		if(type=='alfabeto')
		{
			this.resetSubject();
			libras.inputReset();
			$('#filter-letter #letter-'+addicional.toUpperCase()).addClass('selected');
		}
		else if(type=='assunto')
		{
			libras.inputReset();
			this.resetAlfabeto();
		}
		else if(type=='mao')
		{
			this.resetSubject();
			libras.inputReset();
		}
		else if(type=='search')
		{
			this.resetAll();
		}

		$('#filter-order td').removeClass('selected');
		$('#filter-order td.'+type).addClass('selected');
	},
	setValue: function (field, value)
	{
		if(field =='all')
		{
			this.inputReset();
			this.setInputsText(value);
		}
		else if(field =='palavras')
		{
			this.inputReset();
			$('#input-palavras > option').remove();
			$('#input-palavras').append('<option id="0" selected>-- SELECIONE --</option>');

			$.each(value, function (i, val) {
				$('#input-'+field).append('<option value="'+val.id+'" id="'+val.id+'">'+val.palavra+'</option>');
			});
		}
		else if(field == 'search')
		{
			this.inputReset();
			$('#input-palavras > option').remove();
			$('#input-palavras').append('<option id="0" selected>-- SELECIONE --</option>');

			$.each(value, function (i, val) {
				$('#input-palavras').append('<option value="'+val.id+'" id="'+val.id+'">'+val.palavra+'</option>');
			});
		}
		else if(field =='assunto')
		{
			$('#input-assunto > option').remove();
			$('#input-assunto').append('<option id="0" selected>-- SELECIONE --</option>');
			$.each(value, function (i, val) {
				$('#input-'+field).append('<option value="'+val.id+'" id="'+val.id+'">'+val.nome+'</option>');
			});
		}


	},
	setInputsText: function (data)
	{
		data = data[0];
		$('#input-exemplo').text(data.exemplo);
		$('#input-libras').text(data.libras);
		$('#input-acepcao').text(data.descricao);

		if(data.classe != null)
		{
			var result = this.getObjectById(classes, data.classe);
			if (result.length > 0) {
				$('#input-classe').text(result[0].nome);
			}
		}

		if(data.origem != null)
		{
			var result = this.getObjectById(origem, data.origem);
			if (result.length > 0) {
				$('#input-origem').text(result[0].nome);
			}
		}

		if(data.assunto != null)
		{
			var result = this.getObjectById(assuntos, data.assunto);
			if (result.length > 0) {
				this.setSubject(result[0].id, result[0].nome);
			}
		}

		if(data.image != null)
		{
			$('#input-image').html('<img src="' + urlImages + data.image + '" alt="' + data.palavra + '" />');
		}

		if(data.mao != null)
		{
			var result = this.getObjectById(mao, data.mao);
			if (result.length > 0)
			{
				$('#input-mao').html('<img src="' + urlHands + result[0].url + '" alt="' + data.palavra + '" />');
			}
		}

		if(data.video != null)
		{
			if(data.video.slice(-3) == 'swf')
			{
				this.renderFlash(data.video);
			}
			else
			{
				this.renderVideo(data.video);
			}
		}
	},
	setSubject: function(subjectId, subjectName)
	{
		this.resetSubject();
		$('#input-assunto').append('<option value="'+subjectId+'" id="'+subjectId+'">'+subjectName+'</option>');
	},
	setVideo: function(object)
	{
		$('#input-video').text('');
		$('#input-video').append(object);
	},
	getWordsByLetter: function (letter)
	{
		var result = this.getObjectByFieldAndValue(palavras, 'letra', letter);
		if (result.length > 0) {
			return result;
		}
		return false;
	},
	getWordById: function (wordId)
	{
		var result = this.getObjectById(palavras, wordId);
		if (result.length > 0)
		{
			return result;
		}

		return false;
	},
	getWordsBySubject: function (subject)
	{
		var result = this.getObjectByFieldAndValue(palavras, 'assunto', subject);
		if (result.length > 0) {
			return result;
		}
		return false;
	},
	getWordsByHand: function (hand)
	{
		var result = this.getObjectByFieldAndValue(palavras, 'mao', hand);
		if (result.length > 0) {
			return result;
		}
		return false;
	},
	getSubjects: function()
	{
		return assuntos;
	},
	getWordsBySearch: function (type, search, number)
	{
		var continuie  = false;
		var result = null;

		if ((type == undefined) || (type.length == 0)) { type = 0; }
		if ((search == undefined) || (search.length == 0)) { search = 0; }
		if ((number == undefined) || (number.length == 0)) { number = 0; }

		if(number != 0)
		{
			continuie = true;
			result = this.getObjectByFieldAndValue(palavras, 'ident', number);
		}
		else if((search != 0) && (type !=0))
		{
			if((type=='palavra') || (type=='exemplo') || (type=='descricao'))
			{
				continuie = true;
				result = this.getObjectByFieldAndLikeValue(palavras, type, search);
			}
			else if(type=='assunto')
			{
				var resultAssunto = this.getObjectByFieldAndLikeValue(assuntos, 'nome', search);
				if (resultAssunto[0].id.length > 0)
				{
					continuie = true;
					result = this.getObjectByFieldAndValue(palavras, 'assunto', resultAssunto[0].id);
				}
			}
		}

		if(continuie == true)
		{
			if (result.length > 0) {
				return result;
			}
		}

		return false;
	},
	showHandLightbox: function ()
	{
		$('#container-mao').css('display', 'block');
		$('#bg-splash').css('display', 'block');
	},
	closeLightbox: function()
	{
		$('.lightbox').css('display', 'none');
		$('#bg-splash').css('display', 'none');
	},
	renderFlash: function (url)
	{
		var object = '<object width="100%" height="100%"><param name="movie" value="public/media/palavras/videos/'+url+'"><embed src="public/media/palavras/videos/'+url+'" width="100%" height="100%"></embed></object>';
		//var object = '<video width="100%" height="100%" controls autoplay><source src="public/media/palavras/videos/'+url+'" type="video/mp4">Your browser does not support the video tag.</video>';
		this.setVideo(object);
	},
	renderVideo: function (url)
	{
		var object = '<video width="100%" height="100%" controls autoplay loop><source src="public/media/palavras/videos/'+url+'" type="video/mp4">Your browser does not support the video tag.</video>';
		this.setVideo(object);
		//return;

	},
	getObjectById: function (object, id)
	{
		return this.getObjectByFieldAndValue(object, 'id', id);
	},
	getObjectByFieldAndValue: function (object, field, value)
	{
		var result = $.grep(object, function(e){ return e[field] == value; });
		if (result.length > 0)
		{
			return result;
		}

		return false;
	},
	getObjectByFieldAndLikeValue: function (object, field, value)
	{
		var result = $.grep(object, function(e){ return e[field].toLowerCase().indexOf(value.toLowerCase()) > -1; });
		if (result.length > 0)
		{
			return result;
		}

		return false;
	}
};
