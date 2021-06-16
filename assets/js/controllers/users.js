class Users {

  static init(){
    Users.getAll();
  }

  static getAll(){
    $("#users-table").dataTable({
      processing: true,
      serverSide: true,
      bDestroy: true,
      preDrawCallback: function( settings ) {
        settings._iRecordsTotal = 100;
        settings._iRecordsDisplay = 100;
        console.log(settings);
      },
      paginationType: "simple",
      ajax: {
        url: "api/admin/user",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authentication', localStorage.getItem("token"));},
        dataSrc: function (response) {

          return response;
        },
        data: function ( d ) {
            d.offset = d.start;
            d.limit = d.length;
            d.search = d.search.value;
            d.order = encodeURIComponent((d.order[0].dir == 'asc' ? "-" : "+")+d.columns[d.order[0].column].data);

            delete d.start;
            delete d.lenght;
            delete d.columns;
            delete d.draw;
            console.log(d);
        },

      },
      columns: [
        {"data" : "id",
        "render": function ( data, type, row, meta ) {
                  return '<span class="badge">'+data+'</span><a class="pull-right" style="font-size: 15px; cursor: pointer;" href="#user" onclick="Users.openProfile('+data+')"><i class="fa fa-eye"></i></a>';
                }},
        {"data" : "name"},
        {"data" : "email"},
        {"data" : "password"},
        {"data" : "date_of_joining"},
        {"data" : "faculty_id"},
        {"data" : "department_id"},
        {"data" : "status"},
        {"data" : "role"}
      ]
    });
  }

  static openProfile(data){
    const url = new URL(window.location);
    url.searchParams.set('user', data);
    window.history.pushState({},'', url);
  }

}