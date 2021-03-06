"use strict;"
$(function() {
	var tester = [
	{
	quest: "Какой оператор из этих - выполняет не только математические операции?",
	answ: [
	{text: "+", flag:true},
	{text: "-", flag:false},
	{text: "*", flag:false},
	]
	},
	{
	quest: "Какое событие не вызывается кликом мыши ?",
	answ: [
	{text: "onmousedown", flag:false},
	{text: "onkeydown", flag:true},
	{text: "onfocus", flag:false},
	]
	},
	{
	quest: "Чему равна переменная name ? var name = 'пупкин'.replace('п','д')",
	answ: [
	{text: "пупкин", flag:false},
	{text: "дудкин", flag:false},
	{text: "дупкин", flag:true},
	]
	}
	];
		
// Write
	localStorage["test_1"] = JSON.stringify(tester);

// Read
	var myTester = JSON.parse(localStorage["test_1"]);

	var Html = $("#test").html(); 
	
	var content = tmpl(Html, { 
	data: myTester  
	});

	$('body').append(content);
	
	$('[type=checkbox]').on('click', function(){
		var group = $('input:checkbox[name="'+$(this).attr("name")+'"]');
		$(group).prop('checked', false);
		$(this).prop('checked', true);
	});
	
	
	$('[type=button]').on('click', function(){
		var $chBox = $('input:checked');
		var correct = 0, incorrect = 0, rezult = '';
		for (var k=0; k < $chBox.length; k++) {
			var str = $chBox.eq(k).attr('id');
			var id = str.split('_');
			var i = id[1];
			var j = id[2];
		if (myTester[i].answ[j].flag) correct++;
		else incorrect++;
		}

		if (correct == myTester.length) result = 'Вы успешно прошли тест!';
		else result = 'Тест не пройден!' + ' Неправильных ответов - ' + incorrect; 
		
		$('#overlay').fadeIn(400,
		 	function(){ 
				$('#modal_form') 
					.css('display', 'block') 
					.animate({opacity: 1, top: '50%'}, 200); 
				$('#modal_text') 
				.html(result);
		});
		
		$('#modal_close, #overlay').click( function(){ 
		$('#modal_form')
			.animate({opacity: 0, top: '45%'}, 200, 
				function(){ 
					$(this).css('display', 'none'); 
					$('#overlay').fadeOut(400); 
					$('[type=checkbox]').prop('checked', false);
					var correct = 0, incorrect = 0, rezult = '';
				}
			);
		});
	})	
});


(function(){
  var cache = {};
   this.tmpl = function tmpl(str, data){
    // Выяснить, мы получаем шаблон или нам нужно его загрузить
    // обязательно закешировать результат
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      
      // Сгенерировать (и закешировать) функцию, 
      // которая будет служить генератором шаблонов
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Сделать данные доступными локально при помощи with(){}
        "with(obj){p.push('" +
        
        // Превратить шаблон в чистый JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // простейший карринг(термин функ. прог. - прим. пер.)
    // для пользователя
    return data ? fn( data ) : fn;
  };
})();

