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
    });

    Dashboard.loadLatestQuestions();
  }

  static loadLatestQuestions(){
    let body = {
      "limit" : 3,
      "order": "%2Bid"
    };
    RestClient.get("api/user/question", body, function(data) {
      let text = "";
      for(var i=0; i<data.length; i++){
        text += `<div class='col-lg-12 col-md-12 col-sm-12'>
                              <div class='card bg-grey card-padding card-style' style='height: auto;'>
                                <div class='card-body p-1'>
                                  <h3 class='card-title'>${data[i].subject}</h3>
                                  <h6 class='card-subtitle mb-2 text-muted'>Posted at: ${data[i].posted_at}</h6>
                                  <p class='card-text panel p-1'>${data[i].body}</p>
                                </div>
                                <div class="container-fluid p-1">
                                  <div class="row">
                                    <div class="col-md-6 col-sm-6">
                                      <a onclick='Dashboard.loadAnswers(${data[i].id})' class="pointer" style='text-decoration: none; color:black;'><i class='fa fa-comments'></i>Anwsers</a>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                      <a onclick="Dashboard.showAnswerForm(${data[i].id})" class="pull-right pointer" style='text-decoration: none; color:black;'>Reply</a>
                                    </div>
                                  </div>
                                </div>
                                <div id='dash-answers-container-${data[i].id}' class="container-fluid hidden">
                                  <div class="row" id='dash-answers-list-${data[i].id}'>

                                  </div>
                                  <div class='row text-center'>
                                    <div class="card-footer"><i class="fa fa-chevron-up pointer" onclick='Dashboard.hideAnswers(${data[i].id})'></i></div>
                                  </div>
                                </div>
                                <div id="dash-add-answer-${data[i].id}" class="container-fluid hidden">

                                   <input name="question_id" type="hidden" value="${data[i].id}">
                                   <div class="row m-1">
                                      <textarea name="body" type="text" class="form-control"></textarea>
                                   </div>
                                    <div class="row m-1">
                                      <button onclick="Dashboard.addAnswer('#dash-add-answer-${data[i].id}')" class="btn btn-success" type="button">Send</button>
                                    </div>

                                </div>
                              </div>
                            </div>`;
      }

      $("#latest-questions").html(text);
    });
  }

  static loadAnswers(questionId){
    $.ajax({
       url: "api/user/answers-by-question/"+questionId,
       type: "GET",
       beforeSend: function(xhr){xhr.setRequestHeader('Authentication', localStorage.getItem("token"));},
       data: { "order" : "+is_pinned" },
       success: function(data) {
         let text = "";
         for(var i=0; i<data.length; i++){
           text += `<div class='col-lg-12'>
                       <div class='card bg-info card-padding-s card-style' style='height: auto;'>
                        <div class="card-header">
                          <h6 class='card-subtitle mb-2 text-muted'>Posted by: ${data[i].name}</h6>
                          <h6 class='card-subtitle mb-2 text-muted'>${data[i].posted_at}</h6>
                        </div>
                         <div class='card-body'>
                           <div class="container-fluid">
                              <div class="row">
                                <div class="col-md-10">
                                  <p class='card-text'>${data[i].body}</p>
                                </div>`;
          if(data[i].is_pinned == 1){
              text += `<div id="dash-pin-${data[i].id}" class="col-md-2 green">
              <i onclick='Dashboard.pinned(${data[i].id}, ${data[i].question_id})' class="fa fa-map-pin pointer pull-right"></i>
            </div>`;
          } else {
            text += `<div id="dash-pin-${data[i].id}" class="col-md-2">
            <i onclick='Dashboard.pinned(${data[i].id}, ${data[i].question_id})' class="fa fa-map-pin pointer pull-right"></i>
          </div>`;
          }
          text += `            </div>
                            </div>
                         </div>
                       </div>
                     </div>`;
         }
         try {
           $("#dash-answers-list-"+data[0].question_id).html(text);
           $("#dash-answers-container-"+data[0].question_id).removeClass("hidden");
         } catch(e){
           toastr.error("There is no answers for this question!");
         }
       },
       error: function(jqXHR, textStatus, errorThrown ){
         toastr.error(jqXHR.responseJSON.message);
         console.log(jqXHR);
       }
    });

  }

  static addAnswer(selector){
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
           Dashboard.showAnswerForm(question_id);
           Dashboard.loadAnswers(question_id);
         },
         error: function(jqXHR, textStatus, errorThrown ){
           toastr.error(jqXHR.responseJSON.message);
           console.log(jqXHR);
         }
      });
  }

  static pinned(answer_id, question_id){
    let value = 0;
    if(!$("#dash-pin-"+answer_id).hasClass("green")){
      value = 1;
    }
    $.ajax({
         url: "api/user/answer/pin/"+answer_id+"/"+question_id+"/"+value,
         type: "PUT",
         beforeSend: function(xhr){xhr.setRequestHeader('Authentication', localStorage.getItem("token"));},
         contentType: "application/json",
         success: function(data) {
           toastr.success("Pin updated successfuly!");
           Dashboard.loadAnswers(question_id);
         },
         error: function(jqXHR, textStatus, errorThrown ){
           toastr.error(jqXHR.responseJSON.message);
           console.log(jqXHR);
         }
      });
  }

  static showAnswerForm(question_id){
    $("#dash-add-answer-"+question_id).toggleClass("hidden");
  }

  static hideAnswers(questionId){
    $("#dash-answers-container-"+questionId).addClass("hidden");
  }

}
