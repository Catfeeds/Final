<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class binding_model extends CI_Model
{
    /**
     * This function is used to get the binding 
     * @param number $userId : This is id of binding
     * @return number $count : This is row count
     */
    function getBindingDetailById($bindingId)
    {
        $query = "select binding_history.no, binding_history.state, binding_history.submit_time, binding.bank_phone, binding.credit_no, binding_history.amount, binding.receiver, binding.bank, binding.id_no,binding_history.comment,binding_history.binding_time,
                    user.name, user.phone
                    from binding, `user`, binding_history 
                    where binding.user_id = user.no and binding.no = binding_history.binding_no and binding_history.no=".$bindingId;
        $result = $this->db->query($query);
        return $result->result();
    }

    /**
     * This function is used to get the binding listing count
     * @param string $searchText : This is optional search text
     * @return number $count : This is row count
     */
    function bindingListingCount($searchStatus = null , $searchText = '', $searchState)
    {
        $query = "select binding_history.no, binding_history.state, binding_history.submit_time, binding.bank_phone, binding.credit_no, binding_history.amount, binding.receiver, binding.id_no,
                    user.name, user.phone
                    from binding, `user`, binding_history 
                    where binding.user_id = user.no and binding.no = binding_history.binding_no";
        if($searchState != 10){
            $query = $query . " and binding_history.state like '%" . $searchState ."%'";
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (user.name LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (binding.receiver LIKE '%" . $searchText . "%')";
                }
            }
        }
        $result = $this->db->query($query);

        return count($result->result());
    }

    /**
     * This function is used to get the binding listing count
     * @param string $searchText : This is optional search text
     * @return number $count : This is row count
     */
    function bindingListing($searchStatus = null , $searchText = '', $searchState, $page, $segment)
    {
        $query = "select binding_history.no, binding_history.state, binding_history.submit_time, binding.bank_phone, binding.credit_no, binding_history.amount, binding.receiver, binding.id_no,
                    user.name, user.phone
                    from binding, `user`, binding_history 
                    where binding.user_id = user.no and binding.no = binding_history.binding_no";
        if($searchState != 10){
            $query = $query . " and binding_history.state like '%" . $searchState ."%'";
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (user.name LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (binding.receiver LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query=$query." order by binding_history.submit_time desc";
        if($segment!=""){
            $query = $query." limit ".$segment.", ".$page;
        }
        else{
            $query = $query." limit 0, ".$page;
        }
        $result = $this->db->query($query);

        return $result->result();
    }

    /**
     * This function is used to update the binding information
     * @param string $bindingId : This is id of binding
     * @param array $info : This is information of binding
     * @return number $count : This is row count
     */
    function updateStateById($bindingId, $info)
    {
        $binding = $this->db->query("select binding_no, amount from binding_history where state=0 and no=".$bindingId)->result();
        if($info['state']==2){
            if(count($binding)>0){
                $this->db->query("update binding set amount =  amount+".$binding[0]->amount." where no=".$binding[0]->binding_no);
            }
        }
        if(count($binding)>0){
            $user_id = $this->db->query("select binding.user_id, binding_history.amount from binding, binding_history where binding_history.binding_no = binding.no and binding_history.no=".$bindingId)->result();
            $pay['user_id'] = $user_id[0]->user_id;
            $pay['type'] = $info['state'];
            $pay['amount'] = $user_id[0]->amount;
            $pay['submit_time'] = date("Y-m-d H:i:s");
            $this->db->insert("payment_history", $pay);
                $alarm['user_id'] = $user_id[0]->user_id;
                $alarm['type'] = ($info['state']==1)?1:2;
                $alarm['submit_time'] = date("Y-m-d H:i:s");
                $this->load->model('alarm_user_model');
                $this->alarm_user_model->addAlarm($alarm);
            $this->db->where("no", $bindingId);
            $this->db->update("binding_history", $info);
        }
        return true;
    }

    /**
     * This function is used to get the binding information of current user
     * @param string $userId : This is id of user
     * @return array $result : This is information found
     */
    function getBinding($userId)
    {
        $this->db->select("*");
        $this->db->where("user_id", $userId);
        $this->db->from("binding");
        $result = $this->db->get();
        return $result->result();
    }

    function addNewBinding($open_id){
        $user_id= $this->db->query("select no from user where open_id='".$open_id."'")->result();
        $result=$this->db->query("select * from binding where user_id=".$user_id[0]->no)->result();
        if(count($result)==0){
            $info['user_id'] = $user_id[0]->no;
            $this->db->insert("binding", $info);
        }
        return;
    }

    /**
     * This function is used to add the binding information of current user
     * @param array $info : This is array of binding information
     * @return number $result : This is number of rows inserted into table
     */
    function addBinding($user_id, $info)
    {
        $result=$this->db->query("select * from binding where user_id=".$user_id)->result();
        if(count($result)==0){
            $info['user_id'] = $user_id;
            $this->db->insert("binding", $info);
        }
        else{
            $this->db->where("user_id", $user_id);
            $this->db->update("binding", $info);
        }
            $result = $this->db->affected_rows();
        return $result;
    }

    /**
     * This function is used to add the binding information of current user
     * @param array $info : This is array of binding information
     * @return number $result : This is number of rows inserted into table
     */
    function addNewUser($nickname)
    {
        $user_id = $this->db->query("select no from user where nickname = '".$nickname."'")->result();
        $info['amount'] = 0;
        $info['user_id'] = $user_id[0]->no;
        $this->db->insert("binding", $info);
        $result = $this->db->affected_rows();
        return $result;
    }

    /**
     * This function is used to add the binding history of current user
     * @param array $userId : This is id of user
     * @param array $info : This is array of binding information
     * @return number $result : This is number of rows inserted into table
     */
    function addBindingHistory($userId, $cost)
    {
        $query = $this->db->query("insert payment_history(user_id, type, amount, submit_time) values(".$userId.", 0 ,".$cost.",'".date("Y-m-d H:i:s")."')");
        $this->db->select("amount,no");
        $this->db->from("binding");
        $this->db->where("user_id", $userId);
        $result = $this->db->get()->result();
        $info['amount'] = $result[0]->amount - $cost;
        $this->db->where("user_id", $userId);
        $this->db->update("binding", $info);
        $info['amount'] = $cost;
        $info['binding_no'] = $result[0]->no;
        $info['submit_time'] = date("Y-m-d H:i:s");
        $this->db->insert("binding_history", $info);
        return true;
    }

    /**
     * This function is used to get the binding history of current user
     * @param array $userId : This is id of user
     * @return number $result : This is number of rows inserted into table
     */
    function getBindingHistory($userId)
    {
        $this->db->select("binding_history.submit_time,binding_history.amount,binding_history.binding_time, binding_history.submit_time, binding_history.state");
        $this->db->from("binding_history, binding");
        $this->db->join("binding", "binding.no = binding_history.binding_no");
        $this->db->where("binding.user_id", $userId);
        $this->db->group_by("binding_history.no");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the payment history of current user
     * @param number $userId : This is id of user
     * @return array $result : This is information array of payment of user
     */
    function getPaymentHistory($userId)
    {
        $this->db->select("payment_history.type, payment_history.amount,payment_history.submit_time, event.name");
        $this->db->from("payment_history");
        $this->db->join("event", "event.id = payment_history.event_id", "left");
        $this->db->where("payment_history.user_id", $userId);
        $this->db->order_by("payment_history.submit_time", "desc");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to add the booking money to current user
     * @param number $userId : This is id of user
     * @return array $result : This is information array of payment of user
     */
    function addBooking($event_id, $reg_num, $user_id)
    {
        $cost = $this->db->query("select cost, organizer_id from event where id=".$event_id)->result();
        $result=$this->db->query("select * from binding where user_id=".$cost[0]->organizer_id)->result();
        if(count($result)==0){
            $info['user_id'] = $cost[0]->organizer_id;
            $this->db->insert("binding", $info);
        }
        $total = $cost[0]->cost * $reg_num;
        $binding_no = $this->db->query("select no from binding where user_id = ".$cost[0]->organizer_id)->result();
        $this->db->query("update binding set amount=amount+".$total." where no = ".$binding_no[0]->no);
        $now = date("Y-m-d H:i:s");
        $this->db->query("insert into payment_history(user_id, amount, submit_time, type, event_id) values(".$cost[0]->organizer_id.",".$total.",'".$now."', 3".",".$event_id.")");
        return true;
    }

    /**
     * This function is used to cancel the booking money from organizer
     * @param number $userId : This is id of user
     * @return array $result : This is information array of payment of user
     */
    function cancelBooking($booking_id)
    {
        $event = $this->db->query("select event.organizer_id as user_id, event.id, event.cost, booking.reg_num from event, booking where booking.event_id=event.id and booking.id=".$booking_id)->result();
        $cost = $event[0]->cost * 1;
        $reg_num = $event[0]->reg_num * 1;
        $user_id = $event[0]->user_id;
        $info['amount'] = $cost * $reg_num;
        $amount = $this->db->query("select amount from binding where user_id=".$user_id)->result();
        $amount = $amount[0]->amount - $info['amount'];
        $info['event_id'] = $event[0]->id;
        $info['submit_time'] = date("Y-m-d H:i:s");
        $info['type'] = 4;
        $info['user_id'] = $event[0]->user_id;
        $this->db->query("update binding set amount = ".$amount." where user_id=".$user_id);
        $this->db->insert("payment_history", $info);
        return true;
    }

    /**
     * This function is used to cancel the event money from organizer
     * @param number $event_id : This is id of event
     * @return array $result : This is state of operation
     */
    function cancelEvent($event_id)
    {
        $this->db->select("event.organizer_id,event.name, event.cost, user.role, sum(booking.reg_num) as num");
        $this->db->from("event");
        $this->db->join("booking", "event.id = booking.event_id and booking.state = 0 and booking.pay_type=1", "left");
        $this->db->join("user", "event.organizer_id=user.no");
        $this->db->where("event.id", $event_id);
        $event = $this->db->get()->result();
        $user_id = $event[0]->organizer_id;
        $reg_num = ($event[0]->num==null)?0:$event[0]->num;
        if($reg_num==null)
            $reg_num = 0;
        $cost = $event[0]->cost;
        $info['type'] = 5;
        $info['submit_time'] = date("Y-m-d H:i:s");
        $info['user_id'] = $user_id;
        $sum = 0;
            if($reg_num!=0){
                $bookings = $this->db->query("select booking.user_id, booking.reg_num, booking.pay_type from booking where booking.state=0 and booking.event_id=".$event_id)->result();
                $this->load->model('alarm_user_model');
                foreach ($bookings as $booking) {
                    if($booking->pay_type==1){
                        $info['amount'] = floatval($booking->reg_num * $cost);
                        $sum += floatval($info['amount']);
                        $amount = $this->db->query("select amount from binding where user_id=".$user_id)->result();
                        
                        $amount1 = floatval($amount[0]->amount) - floatval($info['amount']);
                        $this->db->query("update binding set amount = ".$amount1." where user_id=".$user_id);
                        $alarm['submit_time'] = $info['submit_time'];
                        $alarm['user_id'] = $booking->user_id;
                        $alarm['type'] = 11;
                        $alarm['event_type'] = $event[0]->name;
                        $alarm['alarm_org_id'] = $user_id;
                        $alarm['event_id'] = $amount[0]->amount.','.$info['amount'];
                        
                        $this->alarm_user_model->addAlarm($alarm);
                    }
                    else{
                        $alarm['submit_time'] = $info['submit_time'];
                        $alarm['user_id'] = $booking->user_id;
                        $alarm['type'] = 10;
                        $alarm['event_type'] = $event[0]->name;
                        $alarm['alarm_org_id'] = $user_id;
                        $this->alarm_user_model->addAlarm($alarm);
                    }
                }
                $info['amount'] = $sum;
                $this->db->insert("payment_history", $info);
            }
        return true;
    }
}

/* End of file binding_model.php */
/* Location: .application/models/binding_model.php */
