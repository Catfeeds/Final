<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class booking_model extends CI_Model
{
    
    /**
     * This function is used to get some information of booking
     * @param number $bookingId : This is id of booking
     * @return number $count : This is information of booking found
     */
    function getBookingById($bookingId)
    {
        $this->db->select("booking.reg_num as reg_num, booking.name as userName, booking.phone, booking.state,booking.id, booking.pay_type, booking.out_trade_no, booking.out_refund_no");
        $this->db->select("event.id as event_id, event.name,event.agent_name, event.agent_phone, event.type, event.limit, event.cost, 
            event.start_time, event.end_time,  provinces.province,cities.city,areas.area, event.detail_address");
        $this->db->select("user.role, user.avatar");
        $this->db->from("user, event, provinces, cities, areas");
        $this->db->join("booking", "event.id = booking.event_id", "left");
        $this->db->where("user.no = event.organizer_id");
        $this->db->where("event.province = provinces.id");
        $this->db->where("event.city = cities.id");
        $this->db->where("event.area = areas.id");
        $this->db->where("booking.id", $bookingId);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get detailed information of booking
     * @param number $bookingId : This is id of booking
     * @return number $count : This is information of booking found
     */
    function getBookingDetailById($bookingId)
    {
        $this->db->select("user.avatar,booking.name, booking.phone, booking.reg_num, booking.pay_type,booking.id");
        $this->db->from("booking");
        $this->db->join("user", "booking.user_id = user.no");
        $this->db->where("booking.id", $bookingId);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get total amount of registered person to event of the booking
     * @param number $bookingId : This is id of method may be booking or event
     * @param strign $method: this is method of find total
     * @return number $count : This is information of booking found
     */
    function getRegisterNum($id, $method = "event")
    {
        if($method=="booking"){
            $this->db->select('event_id');
            $this->db->from('booking');
            $this->db->where('id', $id);
            $result = $this->db->get()->result();
            $this->db->select("sum(reg_num) as register_num");
            $this->db->from("booking");
            $this->db->where("booking.event_id", $result[0]->event_id);
        }
        else
        {
            $this->db->select("sum(booking.reg_num) as register_num");
            $this->db->from("booking, event");
            $this->db->where("booking.event_id", $id);
            $this->db->where("booking.state", "event.state");
        }
        $query = $this->db->get();
        return $query->result();
    }

        /**
     * This function is used to get detailed information of booking
     * @param number $eventId : This is id of event
     * @return number $count : This is information of booking found
     */
    function getBookingDetailByEvent($eventId)
    {
        $this->db->select("user.avatar,user.nickname,user.no as user_id,  booking.name,booking.phone, booking.reg_num, booking.pay_type, booking.state, event.cost,event.agent_name, event.agent_phone, sum(booking.reg_num) as register_num");
        $this->db->from("booking");
        $this->db->join("user", "booking.user_id = user.no");
        $this->db->join("event", "booking.event_id = event.id");
        $this->db->where("booking.event_id", $eventId);
        $this->db->group_by("booking.id");
        $query = $this->db->get();
        return $query->result();
    }

       /**
     * This function is used to get detailed information of booking
     * @param number $eventId : This is id of event
     * @return number $count : This is information of booking found
     */
    function getBookingDetailByEvent1($eventId)
    {
        $this->db->select("user.avatar,user.nickname,user.no as user_id,  booking.name,booking.phone, booking.reg_num, booking.pay_type, booking.state, event.cost,event.agent_name, event.agent_phone, sum(booking.reg_num) as register_num");
        $this->db->from("booking");
        $this->db->join("user", "booking.user_id = user.no");
        $this->db->join("event", "booking.event_id = event.id and booking.state = event.state");
        $this->db->where("booking.event_id", $eventId);
        $this->db->group_by("booking.id");
        $query = $this->db->get();
        return $query->result();
    }


    /**
    *This function is user to get organizerId 
    *@param number $bookingId: this is id of booking
    *@return number $count: This is organizerId of booking
    */
    function getEventId($bookingId)
    {
        $this->db->select("event_id");
        $this->db->from("booking");
        $this->db->where("id" ,$bookingId);
        $query = $this->db->get();
        return $query->row();
    }

    /**
    *This function is user to get UserId 
    *@param number $bookingId: this is id of booking
    *@return number $count: This is UserId of booking
    */
    function getUserId($bookingId)
    {
        $this->db->select("user_id");
        $this->db->from("booking");
        $this->db->where("id" ,$bookingId);
        $query = $this->db->get();
        return $query->row();
    }
    /**
     * This function is used to get the amount of booking information
     * @param number $searchName : This is id of member or phone
     * @return number $count : This is information of booking found
     */
    function bookingListingCount($searchStatus = null, $searchName = '', $searchType = 100,  $searchState = 10, $searchPay = 10)
    {
         $query = "select booking.id, booking.reg_num, booking.state, booking.submit_time, booking.pay_type,
                    event.cost, event.name as event_name, event.type, booking.name, booking.phone 
                    from booking, user, event
                    where booking.event_id = event.id and booking.user_id = user.no";
        if($searchPay != 10){
            $query = $query." and booking.pay_type = " . $searchPay ;
        }
        if($searchState != 10){
            $query = $query." and booking.state = " . $searchState ;
        }
        if($searchType != 100){
            $query = $query." and event.type = " . $searchType;
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    for($index = 0; $index< strlen($searchText); $index++){
                        if($searchText[$index] == '0'){
                            $searchText = ltrim($searchText, '0');
                        }
                    }
                    $query = $query." and (booking.id LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (user.name LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '2') {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (event.name LIKE '%" . $searchText . "%')";
                }
            }
        }
        $result = $this->db->query($query);
        return count($result->result());
    }

    /**
     * This function is used to get the amount of booking information
     * @param number $searchName : This is id of member or phone
     * @return number $count : This is information of booking found
     */
    function bookingListing($searchStatus = null, $searchText = '', $searchType = 100,  $searchState = 10, $searchPay = 10, $page, $segment)
    {
        $query = "select booking.id, booking.reg_num, booking.state, booking.submit_time, booking.pay_type,
                    event.cost, event.name as event_name, event.type, booking.name, booking.phone, event.organizer_id 
                    from booking, user, event
                    where booking.event_id = event.id and booking.user_id = user.no";
        if($searchPay != 10){
            $query = $query." and booking.pay_type = " . $searchPay ;
        }
        if($searchState != 10){
            $query = $query." and booking.state = " . $searchState ;
        }
        if($searchType != 100){
            $query = $query." and event.type = " . $searchType;
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    for($index = 0; $index< strlen($searchText); $index++){
                        if($searchText[$index] == '0'){
                            $searchText = ltrim($searchText, '0');
                        }
                    }
                    $query = $query." and (booking.id LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (user.name LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '2') {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (event.name LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query=$query." order by booking.submit_time desc";
        if($segment!=""){
            $query = $query." limit ".$segment.", ".$page;
        }
        else{
            $query = $query." limit 0, ".$page;
        }
        $result = $this->db->query($query);
        return $result->result();
    }

    function getCreationName($searchStatus = null, $searchText = '', $searchType = 100,  $searchState = 10, $searchPay = 10,  $page, $segment)
    {
        $query = "select user.nickname as creation_name, count(booking.id)
                    from booking, user, event
                    where booking.event_id = event.id and event.organizer_id = user.no";
        if($searchPay != 10){
            $query = $query." and booking.pay_type = " . $searchPay ;
        }
        if($searchState != 10){
            $query = $query." and booking.state = " . $searchState ;
        }
        if($searchType != 100){
            $query = $query." and event.type = " . $searchType;
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    for($index = 0; $index< strlen($searchText); $index++){
                        if($searchText[$index] == '0'){
                            $searchText = ltrim($searchText, '0');
                        }
                    }
                    $query = $query." and (booking.id LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (user.name LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '2') {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (event.name LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query = $query." group by booking.id";
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
     * This function is used to get the information of booking
     * @param number $userId : This is id of member
     * @param number $eventId : This is id of event
     * @return number $count : This is information of booking found
     */
    function getTotalByUserEvent($userId, $eventId)
    {
        $this->db->select("sum(booking.reg_num) as amount");
        $this->db->from('booking');
        $this->db->where('booking.user_id', $userId);
        $this->db->where('booking.event_id', $eventId);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the information of booking by nickname and state
     * @param number $user_id : This is id of member
     * @return array $result : This is information of booking found
     */
    function getBookingByUser($user_id)
    {
        $this->db->select("booking.id, booking.state, booking.pay_type,sum(booking.reg_num) as reg_num, booking.out_trade_no, booking.out_refund_no");
        $this->db->select("event.id as event_id,event.name, event.type, event.cost, provinces.province,cities.city,areas.area, event.detail_address,event.pic, event.start_time, event.end_time");
        $this->db->select("user.avatar, user.role");
        $this->db->select("sum(rating.id)>0 as favor_state");
        $this->db->from("user,  provinces, cities, areas, booking");
        $this->db->join("event","event.id = booking.event_id");
        $this->db->join("rating","booking.user_id = rating.user_id and booking.event_id = rating.event_id","left");
        $this->db->where("booking.user_id", $user_id);
        $this->db->where("event.state = booking.state");
        $this->db->where("user.no = event.organizer_id");
//        $this->db->where("event.publicity", 1);
        $this->db->where("event.province = provinces.id");
        $this->db->where("event.city = cities.id");
        $this->db->where("event.area = areas.id");
        $this->db->group_by("event.id");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to change the state of booking where the event has ended
     * @param array $event : This is event_id of booking
     * @return boolean $result : This is boolean value of change the state of booking
     */
    function changeStateByEvent($event)
    {
        $alarm['submit_time'] = date("Y-m-d H:i:s");
        $alarm['type'] = 5;
        $state['state'] = 1;
        $this->load->model("alarm_user_model");
        foreach ($event as $eventId) {
            $booking = $this->db->query("select booking.user_id, user.role, booking.reg_num, event.additional from booking, event, user where user.no=event.organizer_id and booking.state=0 and event.id=booking.event_id and booking.event_id=".$eventId->id)->result();
                foreach($booking as $book)
                {
                    if($book->reg_num>0 && ($book->additional ==1 || $book->role==1 )){
                        $alarm['user_id'] = $book->user_id;
                        $alarm['event_id'] = $eventId->id;
                        $this->alarm_user_model->addAlarm($alarm);
                    }
                }
            $this->updateStateByEventId($eventId->id, $state);
        }
        return true;
    }

    /**
     * This function is used to change the state of booking by Event Id
     * @param array $event : This is event_id of booking
     * @return boolean $result : This is boolean value of change the state of booking
     */
    function updateStateByEventId($eventId, $state)
    {
        $this->db->where("state", 0);
        $this->db->where("event_id", $eventId);
        $this->db->update("booking", $state);
        return true;
    }

    /**
     * This function is used to change the state of booking by booking_Id
     * @param array $event : This is event_id of booking
     * @return boolean $result : This is boolean value of change the state of booking
     */
    function updateStateByBookingId($bookingId, $state)
    {
        $this->db->where("id", $bookingId);
        $this->db->update("booking", $state);
        return true;
    }

    /**
     * This function is used to add the booking information of user for a event
     * @param array $booking : This is information array of booking
     * @return boolean $result : This is boolean value of add booking
     */
    function addBooking($booking)
    {
        $this->db->insert("booking", $booking);
        return true;
    }
}

/* End of file booking_model.php */
/* Location: .application/models/booking_model.php */
