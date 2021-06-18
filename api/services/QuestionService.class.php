<?php
require_once dirname(__FILE__) . '/BaseService.class.php';
require_once dirname(__FILE__) . '/../dao/QuestionDao.class.php';

class QuestionService extends BaseService {

  public function __construct(){
    $this->dao = new QuestionDao();
  }
  public function get_questions_by_question_id($user_id, $id){
    return  $this->dao->get_questions_by_question_id($user_id, $id);
  }

  public function remove_question($id){
    return  $this->dao->remove_question($id);
  }

  public function get_question_count($user_id){
    return $this->dao->get_question_count($user_id);
  }

  public function get_questions($user_id, $offset, $limit, $search, $order, $status, $total = FALSE){
    return $this->dao->get_questions($user_id, $offset, $limit, $search, $order, $status, $total);
  }

  public function get_questions_for_departments($order, $department_id, $semester_id, $course_id, $status){
    return  $this->dao->get_questions_for_departments($order, $department_id, $semester_id, $course_id, $status);
  }

  public function post_question($user, $question){
    try {
      //TODO : do validation of the fields
      if($question["course_id"] == ""){
        $question["course_id"] = NULL;
      }
      $data = [
        "subject" => $question["subject"],
        "body" => $question["body"],
        "department_id" => $question["department_id"],
        "course_id" => $question["course_id"],
        "year_id" => $question["year_id"],
        "user_id" => $user["id"],
        "posted_at" => date(Config::DATE_FORMAT),
        "status" => "ACTIVE"
      ];
      return parent::add($data);
    } catch (\Exception $e) {
      throw new Exception("One of the fields is invalid!",403);
    }

  }

  public function update_question($user, $id, $data) {
    $db_question = $this->dao->get_by_id($id);
    if($db_question["user_id"] != $user["id"]) throw new Exception("Invalid question!", 403);
    return $this->update($id, $data);
  }

}

 ?>
