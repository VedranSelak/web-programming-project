class Dashboard {

  static init(){
    $(document).ready(function() {
      RestClient.get("api/user/question-count", null, function(data) {
        $("#question-count").html(data.count);
      });

      RestClient.get("api/user/answer-count", null, function(data) {
        $("#pin-count").html(data.pins);
        $("#answer-count").html(data.count);
      });

      let url = new URL(window.location);
      url.search = '';
      history.replaceState(null, null, url);
    });

    Dashboard.loadLatestQuestions();
    Dashboard.loadLatestAnswers();
    Dashboard.loadHottestQuestions();
  }

  static loadHottestQuestions(){
    RestClient.get("api/user/question/hot", null, function(data) {
      if(data.length === 0){
          $("#dash-question-list").addClass("hidden");
          $("#no-hottest-questions-alert").removeClass("hidden");
      } else {
        $("#dash-question-list").removeClass("hidden");
        $("#no-hottest-questions-alert").addClass("hidden");
      }
      let html = "";
      for(var i=0; i<data.length; i++){
        html += `<div class='col-lg-12'>
                    <div class='card bg-grey card-padding card-style' style='height: auto;'>
                      <div class='card-body p-1'>
                        <h3 class='card-title question-subject'>${data[i].subject}</h3>
                        <h6 class='card-subtitle mb-2 text-muted'><strong>Posted by:</strong> ${data[i].name} ${AskIbuUtils.time(data[i].posted_at)}</h6>
                        <p class='card-text panel p-1'>${data[i].body}</p>
                      </div>
                      <div class="container-fluid p-1">
                        <div class="row">
                          <div class="col-md-6 col-sm-6 col-xs-6">
                            <a onclick='Dashboard.loadAnswers(${data[i].id}, "#hottest")' class="pointer load-hide-answers"><i class='fa fa-comments'></i>Anwsers</a>
                          </div>
                          <div class="col-md-6 col-sm-6 col-xs-6">
                            <a id="hottest-show-answer-form-${data[i].id}" onclick="Dashboard.showAnswerForm(${data[i].id}, '#hottest')" class="pull-right pointer add-answer">+ Add answer</a>
                          </div>
                        </div>
                      </div>

                      <div id='hottest-answers-container-${data[i].id}' class="container-fluid hidden">
                        <div class="row" id='hottest-answers-list-${data[i].id}'>

                        </div>
                        <div class='row text-center'>
                          <div class="card-footer"><i class="fa fa-chevron-up pointer load-hide-answers" onclick='Dashboard.hideAnswers(${data[i].id}, "#hottest")'></i></div>
                        </div>
                      </div>
                      <div id="hottest-add-answer-${data[i].id}" class="container-fluid hidden">

                         <input name="question_id" type="hidden" value="${data[i].id}">
                         <div class="row m-1">
                            <textarea name="body" type="text" class="form-control"></textarea>
                         </div>
                          <div class="row m-1">
                            <button onclick="Dashboard.addAnswer('#hottest-add-answer-${data[i].id}', '#hottest')" class="btn btn-success" type="button">Send</button>
                          </div>

                      </div>
                    </div>
                  </div>`;
      }

       $("#dash-question-list").html(html);
    });
  }

  static loadLatestQuestions(){
    let body = {
      "limit" : 3,
      "order": "%2Bid"
    };
    RestClient.get("api/user/question", body, function(data) {
      if(data.length === 0){
        $("#no-latest-questions-alert").removeClass("hidden");
      } else {
        $("#no-latest-questions-alert").addClass("hidden");
      }
      let text = "";
      for(var i=0; i<data.length; i++){
        text += `<div class='col-lg-12 col-md-12 col-sm-12'>
                    <div class='card bg-grey card-padding card-style' style='height: auto;'>
                      <div class='card-body p-1'>
                        <h3 class='card-title question-subject '>${data[i].subject}</h3>
                        <h6 class='card-subtitle mb-2 text-muted'><strong>Posted</strong> ${AskIbuUtils.time(data[i].posted_at)}</h6>
                        <p class='card-text panel p-1'>${data[i].body}</p>
                      </div>
                      <div class="container-fluid p-1">
                        <div class="row">
                          <div class="col-md-6 col-sm-6 col-xs-6">
                            <a onclick='Dashboard.loadAnswers(${data[i].id}, "#latest-questions")' class="pointer load-hide-answers"><i class='fa fa-comments'></i>Anwsers</a>
                          </div>
                          <div class="col-md-6 col-sm-6 col-xs-6">
                            <a id="latest-questions-show-answer-form-${data[i].id}" onclick="Dashboard.showAnswerForm(${data[i].id}, '#latest-questions')" class="pull-right pointer add-answer">+ Add answer</a>
                          </div>
                        </div>
                      </div>
                      <div id='latest-questions-answers-container-${data[i].id}' class="container-fluid hidden">
                        <div class="row" id='latest-questions-answers-list-${data[i].id}'>

                        </div>
                        <div class='row text-center'>
                          <div class="card-footer"><i class="fa fa-chevron-up pointer load-hide-answers" onclick='Dashboard.hideAnswers(${data[i].id}, "#latest-questions")'></i></div>
                        </div>
                      </div>
                      <div id="latest-questions-add-answer-${data[i].id}" class="container-fluid hidden">

                         <input name="question_id" type="hidden" value="${data[i].id}">
                         <div class="row m-1">
                            <textarea name="body" type="text" class="form-control"></textarea>
                         </div>
                          <div class="row m-1">
                            <button onclick="Dashboard.addAnswer('#latest-questions-add-answer-${data[i].id}', '#latest-questions')" class="btn btn-success" type="button">Send</button>
                          </div>

                      </div>
                    </div>
                  </div>`;
      }
      $("#latest-questions").html(text);

    });
  }

  static loadLatestAnswers(){
    RestClient.get("api/user/answer", { "limit" : 3, "order": "+posted_at" }, function(data){
      if(data.length === 0){
        $("#no-latest-answers-alert").removeClass("hidden");
      } else {
        $("#no-latest-answers-alert").addClass("hidden");
      }
      let text = "";
      for(var i=0; i<data.length; i++){
        text += `<div class='col-lg-12' id="${data[i].id}-your-latest-answer-${data[i].question_id}">
                    <div class='card bg-white border-blue card-padding-s card-style' style='height: auto;'>
                     <div class="card-header">
                       <h6 class='card-subtitle mb-2 text-muted'><strong>Posted by:</strong> ${data[i].name} ${AskIbuUtils.time(data[i].posted_at)}</h6>
                     </div>
                      <div class='card-body'>
                        <div class="container-fluid">
                           <div class="row">
                             <div class="col-md-10 col-sm-10 col-xs-10">
                               <p class='card-text'>${data[i].body}</p>
                             </div>`;
       if(data[i].is_pinned == 1){
           text += `<div id="account-pin-${data[i].id}" class="col-md-2 col-sm-2 col-xs-2 green">
           <i class="fa fa-map-pin fa-2x pull-right"></i>
         </div>`;
       } else {
         text += `<div id="pin-${data[i].id}" class="col-md-2 col-sm-2 col-xs-2">
         <i class="fa fa-map-pin fa-2x pull-right"></i>
       </div>`;
       }
       text += `            </div>
                            <div class="row">
                              <a onclick="Dashboard.loadQuestion(${data[i].question_id}, ${data[i].id})" class="pointer pl-1 toggling-link">Load question</a>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>`;
      }
      $("#latest-answers").html(text);
    });

  }

  static loadQuestion(question_id, answer_id){
    RestClient.get("api/user/question-by-answer/"+answer_id, null, function(data) {
      if(data.length == 0){
        toastr.error("Question of this answer has been removed!");
      } else {
        let text = `<div class='card bg-grey card-padding card-style' style='height: auto;'>
                        <div class='card-body p-1'>
                          <h3 class='card-title question-subject '>${data[0].subject}</h3>
                          <h6 class='card-subtitle mb-2 text-muted'><strong>Posted by:</strong> ${data[0].name} ${AskIbuUtils.time(data[0].posted_at)}</h6>
                          <p class='card-text panel p-1'>${data[0].body}</p>
                        </div>

                        <div class="container-fluid p-1">
                            <div class="row">
                              <div class="col-md-12">
                                <a id="account-answers-show-answer-form-${data[0].id}" onclick="Dashboard.showAnswerForm(${data[0].id}, '#account-answers')" class="pull-right pointer add-answer">+ Add answer</a>
                              </div>
                            </div>
                          </div>

                        <div id='${answer_id}-answers-container-${data[0].id}' class="container-fluid hidden">
                          <div class="row" id='${answer_id}-answers-list-${data[0].id}'>

                          </div>
                          <div class="row text-center">
                              <a onclick="Dashboard.loadAnswer(${answer_id})" class="pointer toggling-link">Load answer</a>
                            </div>
                        </div>
                        <div id="account-answers-add-answer-${data[0].id}" class="container-fluid hidden">

                           <input name="question_id" type="hidden" value="${data[0].id}">
                           <div class="row m-1">
                              <textarea name="body" type="text" class="form-control"></textarea>
                           </div>
                            <div class="row m-1">
                              <button onclick="Dashboard.addAnswer('#account-answers-add-answer-${data[0].id}', '#${answer_id}')" class="btn btn-success" type="button">Send</button>
                            </div>
                        </div>
                      </div>`;
               $("#"+answer_id+"-your-latest-answer-"+question_id).html(text);
               Dashboard.loadAnswers(question_id, `#${answer_id}`);
      }
    });
  }

  static loadTheQuestion(question_id, answer_id){
    $("#"+question_id+"-"+answer_id).toggleClass("bg-grey");
    $("."+question_id+"-"+answer_id+"-question-part").toggleClass("hidden");
  }

  static loadAnswer(answer_id){
    RestClient.get("api/user/answer/"+answer_id, null, function(data){
      let text = `<div class='card bg-white border-blue card-padding-s card-style' style='height: auto;'>
                       <div class="card-header">
                         <h6 class='card-subtitle mb-2 text-muted'><strong>Posted by:</strong> ${data.name} ${AskIbuUtils.time(data.posted_at)}</h6>
                       </div>
                        <div class='card-body'>
                          <div class="container-fluid">
                             <div class="row">
                               <div class="col-md-10 col-sm-10 col-xs-10">
                                 <p class='card-text'>${data.body}</p>
                               </div>`;
     if(data.is_pinned == 1){
         text += `<div id="pin-${data.id}" class="col-md-2  col-sm-2 col-xs-2 green">
                     <i class="fa fa-map-pin fa-2x pull-right"></i>
                   </div>`;
     } else {
       text += `<div id="pin-${data.id}" class="col-md-2 col-sm-2 col-xs-2">
                 <i class="fa fa-map-pin fa-2x pull-right"></i>
               </div>`;
     }
    text += `  </div>
             <div class="row">
              <a onclick="Dashboard.loadQuestion(${data.question_id}, ${data.id})" class="pointer pl-1 toggling-link">Load answer</a>
            </div>
          </div>
        </div>`;
      $(`#${data.id}-your-latest-answer-${data.question_id}`).html(text);
    });
  }

  static loadAnswers(questionId, selector){
    $.ajax({
       url: "api/user/answers-by-question/"+questionId,
       type: "GET",
       beforeSend: function(xhr){xhr.setRequestHeader('Authentication', localStorage.getItem("token"));},
       data: { "order" : "+is_pinned" },
       success: function(data) {
         let text = "";
         for(var i=0; i<data.length; i++){
           text += `<div class='col-lg-12'>
                       <div class='card bg-white card-padding-s card-style' style='height: auto;'>
                        <div class="card-header">
                          <h6 class='card-subtitle mb-2 text-muted'><strong>Posted by:</strong> ${data[i].name} ${AskIbuUtils.time(data[i].posted_at)}</h6>
                        </div>
                         <div class='card-body'>
                           <div class="container-fluid">
                              <div class="row">
                                <div class="col-md-10 col-sm-10 col-xs-10">
                                  <p class='card-text'>${data[i].body}</p>
                                </div>`;
            if(data[i].is_pinned == 1){
                text += `<div id="${selector.substring(1)}-pin-${data[i].id}" class="col-md-2 col-sm-2 col-xs-2 green">
                <i onclick='Dashboard.pinned(${data[i].id}, ${data[i].question_id}, "${selector.substring(1)}")' class="fa fa-map-pin fa-2x pointer pull-right"></i>
              </div>`;
            } else {
              text += `<div id="${selector.substring(1)}-pin-${data[i].id}" class="col-md-2 col-sm-2 col-xs-2">
              <i onclick='Dashboard.pinned(${data[i].id}, ${data[i].question_id}, "${selector.substring(1)}")' class="fa fa-map-pin fa-2x pointer pull-right"></i>
            </div>`;
            }
          text += `            </div>
                            </div>
                         </div>`
                         if(data[i].id == selector.substring(1)){
                           text += `<div class="ml-1">
                                     <a onclick="Dashboard.loadAnswer(${data[i].id})" class="pointer toggling-link">Load answer</a>
                                   </div>`;
                         }
        text +=`
                       </div>
                     </div>`;
         }
         try {
           $(selector+"-answers-list-"+data[0].question_id).html(text);
           $(selector+"-answers-container-"+data[0].question_id).removeClass("hidden");
         } catch(e){
           toastr.error("There is no answers for this question!");
         }
       },
       error: function(jqXHR, textStatus, errorThrown ){
         toastr.error(jqXHR.responseJSON.message);
       }
    });

  }

  static addAnswer(selector, load_selector){
    let question_id = $(selector+" *[name='question_id']").val();
    let body = $(selector+" *[name='body']").val();
    $(selector+" *[name='body']").val("");
    $.ajax({
         url: "api/user/answer",
         type: "POST",
         beforeSend: function(xhr){xhr.setRequestHeader('Authentication', localStorage.getItem("token"));},
         data: JSON.stringify({
            "body" : body,
            "question_id" : question_id
         }),
         contentType: "application/json",
         success: function(data) {
           toastr.success("Answer added successfuly!");
           Dashboard.showAnswerForm(question_id, load_selector);
           Dashboard.loadAnswers(question_id, load_selector);
         },
         error: function(jqXHR, textStatus, errorThrown ){
           toastr.error(jqXHR.responseJSON.message);
         }
      });
  }

  static pinned(answer_id, question_id, selector = ""){
    let value = 0;
    if(!$("#"+selector+"-pin-"+answer_id).hasClass("green")){
      value = 1;
    }
    $.ajax({
         url: "api/user/answer/pin/"+answer_id+"/"+question_id+"/"+value,
         type: "PUT",
         beforeSend: function(xhr){xhr.setRequestHeader('Authentication', localStorage.getItem("token"));},
         contentType: "application/json",
         success: function(data) {
           toastr.success("Pin updated successfuly!");
           Dashboard.loadAnswers(question_id, "#"+selector);
         },
         error: function(jqXHR, textStatus, errorThrown ){
           toastr.error(jqXHR.responseJSON.message);
         }
      });
  }

  static showAnswerForm(question_id, selector){
    $(selector+"-add-answer-"+question_id).toggleClass("hidden");
    $(selector+"-show-answer-form-"+question_id).toggleClass("active");
    if($(selector+"-show-answer-form-"+question_id).hasClass("active")){
      $(selector+"-show-answer-form-"+question_id).html("Hide answer form");
    } else {
      $(selector+"-show-answer-form-"+question_id).html("+ Add answer");
    }
  }

  static hideAnswers(questionId, selector){
    $(selector+"-answers-container-"+questionId).addClass("hidden");
  }

}
