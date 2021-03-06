class UserProfile {

  static init(){
    UserProfile.loadData();
  }

  static loadData(){
    let query = window.location.search;
    const urlParams = new URLSearchParams(query);
    let user_id = urlParams.get("user");

    RestClient.get("api/admin/user/"+user_id, null, function (data){
      RestClient.get("api/admin/department-faculty/"+data.department_id, null, function(data) {
        $("#users-faculty").html("<strong>Users faculty:</strong> " + data.faculty);
        $("#users-department").html("<strong>Users department:</strong> " + data.name);
      });
      $("#users-name").html("<strong>Users name:</strong> " + data.name);
      $("#users-email").html("<strong>Users email:</strong> " + data.email);
      $("#users-password").html("<strong>Users password:</strong> " + data.password);
      $("#users-date-of-joining").html("<strong>Date of joining:</strong> " + data.date_of_joining);
      $("#users-status").html("<strong>Users status:</strong> " + data.status);
      $("#users-role").html("<strong>Users role:</strong> " + data.role);
    });

    $("#user-question-table").dataTable({
      processing: true,
      serverSide: true,
      bDestroy: true,
      paginationType: "simple",
      responsive: true,
      preDrawCallback: function( settings ) {
        if(settings.jqXHR) {
          settings._iRecordsTotal = settings.jqXHR.getResponseHeader("total-records");
          settings._iRecordsDisplay = settings.jqXHR.getResponseHeader("total-records");
        }
      },
      ajax: {
        url: "api/admin/question",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authentication', localStorage.getItem("token"));},
        dataSrc: function (response) {
          return response;
        },
        data: function ( d ) {
            d.status = "ALL";
            d.user_id = user_id;
            d.offset = d.start;
            d.limit = d.length;
            d.search = d.search.value;
            d.order = encodeURIComponent((d.order[0].dir == 'asc' ? "-" : "+")+d.columns[d.order[0].column].data);

            delete d.start;
            delete d.lenght;
            delete d.columns;
            delete d.draw;
        },
      },
      columns: [
        {"data" : "id",
        "render": function ( data, type, row, meta ) {
                  if (row.status == "REMOVED"){
                    return '<div style="min-width: 140px;"><span class="badge">'+data+'</span><a class="pull-right" style="font-size: 15px; cursor: pointer;" onclick="UserProfile.retrieveQuestion('+data+')"><i class="fa fa-check text-success"></i></a></div>';
                  }
                  return '<div style="min-width: 140px;"><span class="badge">'+data+'</span><a class="pull-right" style="font-size: 15px; cursor: pointer;" onclick="UserProfile.removeQuestion('+data+')"><i class="fa fa-minus-circle text-red"></i></a></div>';
                }},
        {"data" : "subject"},
        {"data" : "body"},
        {"data" : "department_id"},
        {"data" : "course_id"},
        {"data" : "posted_at"},
        {"data" : "user_id"},
        {"data" : "semester_id"},
        {"data" : "status"}
      ]
    });

    $("#user-answers-table").dataTable({
      processing: true,
      serverSide: true,
      bDestroy: true,
      responsive: true,
      preDrawCallback: function( settings ) {
        if(settings.jqXHR) {
          settings._iRecordsTotal = settings.jqXHR.getResponseHeader("total-records");
          settings._iRecordsDisplay = settings.jqXHR.getResponseHeader("total-records");
        }
      },
      paginationType: "simple",
      ajax: {
        url: "api/admin/answers",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authentication', localStorage.getItem("token"));},
        dataSrc: function (response) {
          return response;
        },
        data: function ( d ) {
            d.status = "ALL";
            d.user_id = user_id;
            d.offset = d.start;
            d.limit = d.length;
            d.search = d.search.value;
            d.order = encodeURIComponent((d.order[0].dir == 'asc' ? "-" : "+")+d.columns[d.order[0].column].data);

            delete d.start;
            delete d.lenght;
            delete d.columns;
            delete d.draw;
        },

      },
      columns: [
        {"data" : "id",
        "render": function ( data, type, row, meta ) {
                  if (row.status == "REMOVED"){
                    return '<div style="min-width: 60px;"><span class="badge">'+data+'</span><a class="pull-right" style="font-size: 15px; cursor: pointer;" onclick="UserProfile.retrieveAnswer('+data+')"><i class="fa fa-check text-success"></i></a></div>';
                  }
                  return '<div style="min-width: 60px;"><span class="badge">'+data+'</span><a class="pull-right" style="font-size: 15px; cursor: pointer;" onclick="UserProfile.removeAnswer('+data+')"><i class="fa fa-minus-circle text-red"></i></a></div>';
                }},
        {"data" : "body"},
        {"data" : "is_pinned"},
        {"data" : "user_id"},
        {"data" : "question_id"},
        {"data" : "posted_at"},
        {"data" : "status"}
      ]
    });

  }

  static removeQuestion(question_id){
    RestClient.put("api/admin/remove/question/"+question_id, null, function() {
      toastr.success("Question removed successfuly!");
    });
    UserProfile.loadData();
  }

  static retrieveQuestion(question_id){
    RestClient.put("api/admin/retrieve/question/"+question_id, null, function() {
      toastr.success("Question retrieved successfuly!");
    });
    UserProfile.loadData();
  }

  static removeAnswer(answer_id){
    RestClient.put("api/admin/remove/answer/"+answer_id, null, function() {
      toastr.success("Answer removed successfuly!");
    });
    UserProfile.loadData();
  }

  static retrieveAnswer(answer_id){
    RestClient.put("api/admin/retrieve/answer/"+answer_id, null, function() {
      toastr.success("Answer retrieved successfuly!");
    });
    UserProfile.loadData();
  }

}
