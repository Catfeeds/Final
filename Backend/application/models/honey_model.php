<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class honey_model extends CI_Model
{
    /**
     * This function is used to get the honey in 5km from current user
     * @param float $longitude : This is longitude of current user
     * @param float $latitude: This is latitude of the current user
     * @return array $result : information of honey found
     */
    function getHoneyByDistance($longitude, $latitude)
    {
        $this->db->select("no, longitude, latitude, amount, pick_choice");
        $this->db->from("honey");
        $this->db->where("( 6371 * acos( cos( radians($latitude) ) * cos( radians( latitude) ) 
   * cos( radians(longitude) - radians($longitude)) + sin(radians($latitude)) 
   * sin( radians(latitude))))<=10");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to subtract the honey with amount current user catch
     * @param number $amount : This is amount of user cathced
     * @param number $no : This is no of honey user catched
     * @return boolean $result : state of subtract
     */
    function catchHoney($no, $amount)
    {
        $this->db->select("amount");
        $this->db->from("honey");
        $this->db->where("no", $no);
        $result = $this->db->get()->result();
        if($result[0]->amount == $amount)
        {
            $this->db->where("no", $no);
            $this->db->delete("honey");
        }
        else{
            $this->db->query("update honey set amount=(amount-".(1*$amount)."), pick_choice=pick_choice+1 where no=$no");
        }
        return true;
    }

    /**
     * This function is used to check the honey which are available from time limit
     * @return boolean $result : state of subtract
     */
    function checkHoney()
    {
        $now = date("Y-m-d H:i:s");
        $this->db->query("delete from honey where TIME_TO_SEC(TIMEDIFF(now(), create_time))>86400");
        return true;
    }

    /**
     * This function is used to add honey when booking happen
     * @return boolean $result : state of adding
     */
    function addHoney($events)
    {
        foreach($events as $event_id){
            $reg_num = $this->db->query("select sum(booking.reg_num) as amount from event, booking
                where booking.state = event.state and event.id = booking.event_id and event.id=".$event_id->id)->result();
            $user = $this->db->query("select user.role from user, event where event.organizer_id = user.no and event.id = ".$event_id->id )->result();
            if($user[0]->role == 2){
                $additional = $this->db->query("select additional from event where event.id=".$event_id->id)->result();
                if($additional[0]->additional == 1){
                    $position = $this->db->query("select longitude, latitude from event where event.id = ".$event_id->id)->result();
                    $honey_total = $this->db->query("select value from rule where no=2")->result();
                }
            }
            else
            {
                $position = $this->db->query("select boss.longitude, boss.latitude, boss.no from boss, event where event.organizer_id = boss.boss_id and event.id = ".$event_id->id)->result();
                $honey_total = $this->db->query("select value from rule where no=1")->result();
            }
            $honey_portion = $this->db->query("select value from rule where no=5")->result();
            $honey['amount'] = $honey_total[0]->value/(1.0 + $honey_portion[0]->value)*$honey_portion[0]->value*$reg_num[0]->amount;
            $honey['create_time'] = date("Y-m-d H:i:s");
            $honey['longitude'] = $position[0]->longitude;
            $honey['latitude'] = $position[0]->latitude;
            if($user[0]->role == 1 && $honey['amount'] != 0){
                $honey['position'] = $position[0]->no;
                $state = $this->db->query("select no from honey where position=".$position[0]->no)->result();
                if($state!=null)
                {
                    $this->db->query("update honey set amount= amount+".(1*$honey['amount']).", create_time = '".$honey['create_time']."'  where no=".$state[0]->no);
                }
                else{
                    $this->db->insert("honey", $honey);
                }
            }
            else if($honey['amount'] != 0)
            {
                    $this->db->insert("honey", $honey);
            }
        }   
        return true;
    }
}

/* End of file honey_model.php */
/* Location: .application/models/honey_model.php */
