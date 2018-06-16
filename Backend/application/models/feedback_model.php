<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class feedback_model extends CI_Model
{

    /**
    *This is function to get feedbacks of event
    */
    function getFeedbacks($event_id){
        $this->db->select("user.avatar, user.nickname, feedback.comment, feedback.submit_time");
        $this->db->from("feedback, user");
        $this->db->where("feedback.user_id = user.no");
        $this->db->where("feedback.event_id", $event_id);
        $this->db->group_by("feedback.no");
        $this->db->order_by("feedback.submit_time", "desc");
        $result = $this->db->get();

        return $result->result();
    }

    /**
    *This is function to add feedback to event
    */
    function addFeedback($info){
        $this->db->insert('feedback', $info);
        return true;
    }

}

/* End of file feedback_model.php */
/* Location: .application/models/feedback_model.php */
