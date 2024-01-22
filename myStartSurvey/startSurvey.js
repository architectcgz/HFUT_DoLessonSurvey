/**
 * Created by wx on 17-11-19.
 */
var drawSurvey = function (res) {
  var teacher = res.teacher || ''
  var survey = res.survey || '';
  var surveyDisplayConfig = res.lessonSurveyLesson?res.lessonSurveyLesson.surveyDisplayConfig:'';
  var courseName = res.courseName || survey.name;
  var allQuestons = [];
  
  var $container = $("#surveyContainer")
  $container.append('<div class="title"></div>');
  $container.append('<div class="survey"></div>');
  $container.find('.title').append('<h2 class="courseName">'+courseName+'</h2>');
  $container.find('.title').append('<input type="hidden" class="courseName" id="surveyId" value="'+survey.id+'"/>');
  $container.find('.title').append('<input type="hidden" class="scoring" value="'+survey.scoring+'" value="scoring"/>');
  $container.find('.title').append('<h2 class="teacher">'+teacher+'</h2>');
  var str = survey.fullScore!==null&&surveyDisplayConfig.showTotalScore?'('+survey.fullScore+'分)':'';
  $container.find('.title').append('<h2 class="totalScore" style="display:inline-block;">'+str+'</h2>');
  var description = survey.description!=null?survey.description:'';
  $container.find('.title').append('<p class="description">'+description+'</p>');

  allQuestons = survey.blankQuestions.concat(survey.radioQuestions,survey.headers);

  allQuestons = _.sortBy(allQuestons, 'indexNo');
  var len =allQuestons.length;
  var questionIndex = 1;
  $.each(allQuestons,function (index, item) {

    var fullScore = item.fullScore ? "(" +item.fullScore+")": '';
    var $des = $('<p class="description">'+item.description+'</p>');
    var $optionGroup = $('<div class="group"></div>');
	
    if(item.options){
      //单选
      var className = item.orientation == 'VERTICAL' ? 'radio' :'radio-inline col-sm-3';
      if(item.indexNo==1 && index==1 && res.syllabus){
          if(res.syllabus.courseObjectives){
              var courseObjectives = res.syllabus.courseObjectives;
			  
              $.each(courseObjectives,function (j, value) {
                  var $courseOptionGroup = $('<div class="group"></div>');
                  var $courseObjectTitle = $('<label>'+(questionIndex++)+'.    '+ value.name+'</label>');
                  var choosed = 0;//使用这个变量来选中第一个结果
				  $.each(item.options,function (i, option) {
                      var str = surveyDisplayConfig.showOptionScore?'('+option.score+')':'';
					  var $option = $('');
					  if(choosed%2===0&&choosed<=1){
						$option = $('<div class="'+className+'"><label><input value="'+option.name+'" questionId ="'+value.id+'"  type="radio" name="'+value.id+'" checked/>'+option.name+'   '+str+'</label></div>');
                      }
					  else{ 
						$option = $('<div class="'+className+'"><label><input value="'+option.name+'" questionId ="'+value.id+'"  type="radio" name="'+value.id+'"/>'+option.name+'   '+str+'</label></div>');
						}
					  choosed++;
					  $courseOptionGroup.append($option)
                  })
				  choosed = 0;
                  $container.find('.survey').append($courseObjectTitle);
                  $container.find('.survey').append($des);
                  $container.find('.survey').append($courseOptionGroup);
                  $container.find('.survey').append("<div class='clearfix'></div>");
                  $('input[name="'+value.id+'"]').rules('add','required');
                  $container.find('.survey').append("<hr/>")
              })
          }

          if(res.syllabus.learningObjectives){
              var learningObjectives = res.syllabus.learningObjectives;
              $.each(learningObjectives,function (j, value) {
                  var $learningOptionGroup = $('<div class="group"></div>');
                  var $learningObjectTitle = $('<label>'+(questionIndex++)+'.    '+ value.name+'</label>');
                  var choosed = 0;
				  $.each(item.options,function (i, option) {
                      var str = surveyDisplayConfig.showOptionScore?'('+option.score+')':'';
                      
				var $option = $('');
				if(choosed%2===0&&choosed<=1){
					$option = $('<div class="'+className+'"><label><input value="'+option.name+'" questionId ="'+value.id+'"  type="radio" name="'+value.id+'" checked/>'+option.name+'   '+str+'</label></div>');
				
				}else{
					$option = $('<div class="'+className+'"><label><input value="'+option.name+'" questionId ="'+value.id+'"  type="radio" name="'+value.id+'"/>'+option.name+'   '+str+'</label></div>');
				
				}
					  choosed += 1;
					  $learningOptionGroup.append($option)
                  })
                  $container.find('.survey').append($learningObjectTitle);
                  $container.find('.survey').append($des);
                  $container.find('.survey').append($learningOptionGroup);
                  $container.find('.survey').append("<div class='clearfix'></div>");
                  $('input[name="'+value.id+'"]').rules('add','required');
                  $container.find('.survey').append("<hr/>")
              })
          }
      }

      var scoreStr = surveyDisplayConfig.showQuestionScore?fullScore:'';
      var $title = $('<label>'+(questionIndex++)+'.    '+ item.title+'<span class="score">'+scoreStr+'</span>'+'</label>');
	var choosed = 0;
      $.each(item.options,function (i, option) {
        var str = surveyDisplayConfig.showOptionScore?'('+option.score+')':'';
        var $option = $('');
		if(choosed%2===0&&choosed<=1){
			$option = $('<div class="'+className+'"><label><input value="'+option.name+'" questionId ="'+item.id+'"  type="radio" name="'+item.id+'" checked/>'+option.name+'   '+str+'</label></div>');
		}else{
			$option = $('<div class="'+className+'"><label><input value="'+option.name+'" questionId ="'+item.id+'"  type="radio" name="'+item.id+'" />'+option.name+'   '+str+'</label></div>');
		}
		  
		choosed += 1;
		  $optionGroup.append($option)
      })
		
      $container.find('.survey').append($title);
      $container.find('.survey').append($des);
      $container.find('.survey').append($optionGroup);
      $container.find('.survey').append("<div class='clearfix'></div>");
      $('input[name="'+item.id+'"]').rules('add','required');
    }else if(item.height){
      //填空
      var row = item.height;
      var $title = $('<label>'+(questionIndex++)+'.    '+ item.title+'</label>');
      $container.find('.survey').append($title);
      $container.find('.survey').append($des);
      var placeholderStr = '请至少输入'+item.minLength+'个字符，至多输入'+item.maxLength+'个字符';
      $container.find('.survey').append('<textarea questionId ="'+item.id+'"  class="form-control" name="'+item.id+'" rows="'+row+'" placeholder="'+placeholderStr+'">非常好</textarea>');
      if(Number(item.minLength)>0){
        $('textarea[name="'+item.id+'"]').rules('add','required');
      }

    }else {
      //章节
      var $title = $('<label>'+item.title+''+fullScore+'</label>');

      $container.find('.survey').append($title);
      $container.find('.survey').append($des);
    }

    index < len-1 ? $container.find('.survey').append("<hr/>"): ''
  })
}