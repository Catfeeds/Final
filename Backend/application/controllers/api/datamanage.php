<?php defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');


/**
* User_Manage API controller
*
*/
class datamanage extends CI_Controller
{

public function __construct()
{
parent::__construct();
$this->load->model('user_model');
$this->load->model('booking_model');
$this->load->model('event_model');
$this->load->model('rating_model');
$this->load->model('member_state_model');
$this->load->model('rule_model');
$this->load->model('boss_model');
$this->load->model('accept_address_model');
$this->load->model('honey_model');
$this->load->model('favourite_event_model');
$this->load->model('goods_model');
$this->load->model('exchange_model');
$this->load->model('binding_model');
$this->load->model('alarm_user_model');
$this->load->model('alarm_admin_model');
$this->load->model('feedback_model');
$this->checkEventState();
}

/*
* this function is used to add new user who entered into the fengti, 
but only nickname and avatar
*/
public function addNewUser()
{
$book = json_decode(file_get_contents("php://input"));
$user['nickname'] = $this->filter($book->{"nickname"});
$user['avatar'] = $book->{'avatar'};
$user['open_id'] = $book->{'open_id'};
$user['reg_time'] = date("Y-m-d H:i:s");
$this->binding_model->addNewUser($user['nickname']);
$result = $this->user_model->addNewUser($user);
if (count($result)>0) {
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get all of the information of the user by using nickname
*/
public function getState()
{
$book = json_decode(file_get_contents("php://input"));
$nickname = $book->{'nickname'};
$result = $this->user_model->getState($nickname);
if(count($result)>0){
$member = $this->member_state_model->getStateById($result[0]->no);
echo json_encode(array('status' => true, 'result' => $result, 'member' => $member), 200);
} else {
echo json_encode(array('status' => false), 200);
}
exit;
}

/*
* this function is used to get all of the information of the user by using nickname
*/
public function haveStadium()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$result = $this->db->query("select site_introduction from boss where boss_id=".$user_id)->result();
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
exit;
}

/*
* this function is used to get all of the information of the user by using nickname
*/
public function getUserStateByOpenId()
{
$book = json_decode(file_get_contents("php://input"));
$open_id = $book->{'open_id'};
$result = $this->user_model->getStateByOpenId($open_id);
if(count($result)>0){
$member = $this->member_state_model->getStateById($result[0]->no);
$this->binding_model->addNewBinding($open_id);
echo json_encode(array('status' => true, 'result' => $result, 'member' => $member), 200);
} else {
echo json_encode(array('status' => false), 200);
}
exit;
}

/*
* this function is used to get detail information of the user by using user_id
*/
public function getUserDetail()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$result = $this->user_model->getUserDetailById($user_id);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get all of the booking information 
which the user want to see by the nickname of the user and the state of booking
*/
public function getMyBooking()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{"user_id"};
$result = $this->booking_model->getBookingByUser($user_id);
$register_num = $this->event_model->getRegisterNum($result);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result, 'register_num' => $register_num), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

public function getBackyard()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{"user_id"};
$result = $this->db->query("select * from honey_backyard where user_id=".$user_id)->result();
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get all of the booking information 
which the user want to see by the nickname of the user and the state of booking
*/
public function getAllBoss()
{
$result = $this->db->query("select boss.no, boss.site_name, boss.longitude, boss.latitude from boss")->result();
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get detail of the booking information 
which the user want to see by id of booking
*/
public function getBookingDetail()
{
$book = json_decode(file_get_contents("php://input"));
$bookingId = $book->{'booking_id'};
$userId = $book->{'user_id'};
$result = $this->booking_model->getBookingById($bookingId);
$register_num = $this->db->query("select sum(booking.reg_num) as register_num from event, booking 
where event.state =booking.state and booking.event_id = event.id and event.id = ".$result[0]->event_id)->result();
$rating = $this->rating_model->getRatingByBooking($bookingId, $userId);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result, 'rating' => $rating, 'register_num' => $register_num), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

function test()
{
$site_icon = '1.png';
$im_dest = '0000.png';
$config['image_library'] = 'gd2';
$config['source_image'] = "./uploads/".$site_icon;
$config['new_image'] = "./uploads/temp.png";
$config['create_thumb'] = FALSE;
$config['file_permissions'] = "0777";
$config['maintain_ratio'] = FALSE;
$config['width']         = "49";
$config['height']       = "36";

$this->load->library('image_lib', $config);

if(!$this->image_lib->resize()){
$this->image_lib->display_errors();
}
$this->image_lib->clear();
$config['image_library'] = 'gd2';
$config['source_image'] = './assets/images/map.png';
$config['new_image'] = 'uploads/'.$im_dest;
$config['wm_type'] = 'overlay';
$config['wm_opacity'] = '100';
$config['wm_vrt_alignment'] = 'top';
$config['wm_hor_alignment'] = 'left';
$config['wm_hor_offset'] = '11';
$config['wm_vrt_offset'] = '28';
$config['wm_overlay_path'] = "./uploads/temp.png";

$this->image_lib->initialize($config);

if(!$this->image_lib->watermark()){
$this->image_lib->display_errors();
}
echo "success";exit;

}
/*
* this function is used to check the state of all events 
with the comparation of end_time and now 
then change the state and also change the state of booking
which is associated with those events
*/
function checkEventState()
{
$endedEvents = $this->event_model->checkStateByTime();
$this->booking_model->changeStateByEvent($endedEvents);
$this->event_model->checkStateByAlarm();
$this->honey_model->addHoney($endedEvents);
$this->honey_model->checkHoney();
$this->exchange_model->setAutoEndExchange();
}

/*
* this function is used to cancel the booking of the user
*/
public function cancelBooking()
{
$book = json_decode(file_get_contents("php://input"));
$booking_id = $book->{"booking_id"};
$result = $this->db->query("select pay_type from booking where id=".$booking_id)->result();
if($result[0]->pay_type==1){
$state['out_refund_no'] = $book->{'out_refund_no'};
}
$result = $this->db->query("select event.organizer_id, booking.user_id, booking.pay_type, event.name from event, booking where booking.event_id = event.id and booking.id=".$booking_id)->result();
$alarm['user_id'] = $result[0]->organizer_id;
$alarm['type'] = 4;
$alarm['alarm_org_id'] = $result[0]->user_id;
$alarm['event_type'] = $result[0]->name;
$alarm['submit_time'] = date("Y-m-d H:i:s");
$this->alarm_user_model->addAlarm($alarm);
if($result[0]->pay_type==1){
$alarm1['user_id'] = $alarm['alarm_org_id'];
$alarm1['type'] = 8;
$alarm1['event_type'] = $alarm['event_type'];
$alarm1['submit_time'] = $alarm['submit_time'];
$this->alarm_user_model->addAlarm($alarm1);
$this->binding_model->cancelBooking($booking_id);
}
$state['state'] = 2;
$result = $this->booking_model->updateStateByBookingId($booking_id, $state);
if($result){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add the rating to the site which its' event that the user entered is finished.
*/
public function addRating()
{
$book = json_decode(file_get_contents("php://input"));
$info['point'] = $book->{"point"};
$info['comment'] = $book->{"comment"};
$booking_id= $book->{'booking_id'};
$result = $this->db->query("select user_id, event_id from booking  where id=".$booking_id)->result();
$info['user_id'] = $result[0]->user_id;
$info['event_id'] = $result[0]->event_id;
$info['submit_time'] = date("Y-m-d H:i:s");
$result = $this->db->query("select organizer_id, type from event where id=".$info['event_id'])->result();
$alarm['user_id'] = $result[0]->organizer_id;
$alarm['alarm_org_id'] = $info['user_id'];
$alarm['submit_time'] = $info['submit_time'];
$alarm['type'] = 0;
$this->alarm_user_model->addAlarm($alarm);
$result = $this->rating_model->addRating($info);
if($result>0){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get information of all events that user created
*/
public function getEventByUser()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{"user_id"};
$result = $this->event_model->getEventByUser($user_id, 3);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get information of all events which have been placing in the city the user locate
*/
public function getEventByProvince()
{
$book = json_decode(file_get_contents("php://input"));
$city = $book->{'city'};
$province = $book->{'province'};
$user_id = $book->{"user_id"};
$result = $this->event_model->getEventByProvince($province, $city, $user_id);
$favor = $this->getFavouriteAmount($result);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result, 'favor' => $favor), 200);
} else {
echo json_encode(array('status' => false, 'result' => $result), 200);
}
}

public function getFavouriteAmount($result)
{
$fav_amount = array();
for($index = 0; $index<count($result); $index++)
{
$fav = $this->db->query("select count(favourite_event.no) as amount from favourite_event, event where event.id=favourite_event.event_id and event.id=".$result[$index]->id)->result();
if(count($fav)>0){
$fav_amount[$index] = $fav[0]->amount;
}
else{
$fav_amount[$index] = 0;   
}
}
return $fav_amount;
}

/*
* this function is used to get detail information of events that user selected
*/
public function getEventDetail()
{
$book = json_decode(file_get_contents("php://input"));
$event_id = $book->{"event_id"};
$user_id = $book->{'user_id'};
$result = $this->event_model->getEventDetailById($event_id, $user_id);
$booking = $this->booking_model->getBookingDetailByEvent($event_id);
$rating = $this->favourite_event_model->getFavouriteDetailByUser($user_id, $event_id);
$rating_detail = $this->rating_model->getRatingByEvent($event_id);
$register_num = $this->booking_model->getRegisterNum($event_id);
$is_rating = $this->favourite_event_model->is_rating($user_id);
$favor = $this->getFavouriteAmount($result);
$feedbacks= $this->feedback_model->getFeedbacks($event_id);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result, 'booking' => $booking, 'rating' => $rating, 'rating_detail' => $rating_detail, 'register_num' => $register_num, 'favor' => $favor, 'feedbacks' => $feedbacks), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add feedback to event
*/
public function addFeedback(){
    $book = json_decode(file_get_contents("php://input"));
    $info['event_id'] = $book->{"event_id"};
    $info['user_id'] = $book->{'user_id'};
    $info['comment'] = $book->{'comment'};
    $info['submit_time'] = date("Y-m-d H:i:s");
    $this->feedback_model->addFeedback($info);
    echo json_encode(array('status' => true), 200);
}


/*
* this function is used to set favourite state of event
*/
public function setFavouriteEvent()
{
$book = json_decode(file_get_contents("php://input"));
$event_id = $book->{"event_id"};
$user_id = $book->{"user_id"};
$result = $this->favourite_event_model->setFavouriteEvent($user_id, $event_id);
if($result){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add booking information of user for a event
*/
public function addBooking()
{
$book = json_decode(file_get_contents("php://input"));
$role = $book->{'role'};
$info['event_id'] = $book->{"event_id"};
$info['user_id'] = $book->{"user_id"};
$info['reg_num'] = $book->{"reg_num"};
$info['name'] = $book->{"name"};
$info['phone'] = $book->{'phone'};
$info['pay_type'] = $book->{"pay_type"};
if($role==1){
if($info['pay_type'] ==1 ){
$info['out_trade_no'] = $book->{'out_trade_no'};
$this->binding_model->addBooking($info['event_id'], $info['reg_num'], $info['user_id']);
}
}
$info['submit_time'] = date("Y-m-d H:i:s");
$result = $this->db->query("select organizer_id, name from event where id=".$info['event_id'])->result();
$alarm['user_id'] = $result[0]->organizer_id;
$alarm['type'] = 3;
$alarm['event_type'] = $result[0]->name;
$alarm['alarm_org_id'] = $info['user_id'];
$alarm['submit_time'] = date("Y-m-d H:i:s");
$alarm1 = $this->alarm_user_model->addAlarm($alarm);
$result = $this->booking_model->addBooking($info);
if($result){
echo json_encode(array('status' => true,'s' =>$alarm1, 'ss'=>$alarm), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get detail information of booking to this event
*/
public function getBookingDetailByEvent()
{
$book = json_decode(file_get_contents("php://input"));
$event_id = $book->{"event_id"};
$booking = $this->booking_model->getBookingDetailByEvent1($event_id);
if(count($booking)>0){
echo json_encode(array('status' => true, 'booking' => $booking), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to cancel the event which user created
*/
public function cancelEvent()
{
$book = json_decode(file_get_contents("php://input"));
$event_id = $book->{"event_id"}; 
$state['state'] = 2;

include 'WinxinRefund.php'; 
$appid='wxea381fb0ca7c2a24';  
$mch_id='1500220062';  
$key='fengtiWeixin17642518820android12';  
$user_open_id = $this->db->query("select user.open_id 
            from user left join event on event.organizer_id = user.no 
                        where event.id=" . $event_id)->row();
$booking = $this->db->query("select user.open_id, event.cost,booking.id, booking.reg_num, booking.out_trade_no, booking.pay_type 
from user, event left join booking on booking.event_id=event.id and booking.state=0 
where user.no=booking.user_id and event.id=".$event_id." group by booking.id")->result(); 
//$booking = $this->db->query("select user.open_id, event.cost,booking.id, booking.reg_num, booking.out_trade_no, booking.pay_type 
//from user, event left join booking on booking.event_id=event.id 
//where user.no=booking.user_id group by booking.id")->result(); 

if(count($booking)>0){
foreach($booking as $book){
if($book->pay_type==1){
$openid= $book->open_id;  
$out_trade_no = $book->out_trade_no; 
$total_fee = $book->cost * $book->reg_num;
$total_fee = $book->cost*$book->reg_num;
if(empty($total_fee)) //押金  
{  
$body = "退款押金";  
$total_fee = floatval(99*100);  
}  
else {  
$body = "退款余额";  
$total_fee = floatval($total_fee*100);  
}  //$openid,$outTradeNo,$totalFee,$outRefundNo,$refundFee
$refund_fee = $total_fee;
list($usec, $sec) = explode(" ", microtime());
$out_refund_no = $mch_id.$sec;
$weixinpay = new WinXinRefund($appid, $mch_id, $user_open_id, $out_trade_no, $total_fee, $out_refund_no, $refund_fee, $key);
$return = true;
//if($refund_fee == 1)
  $return = $weixinpay->refund();
echo json_encode(array('status'=>json_encode($return),'value'=>($appid.','.$mch_id.','.$openid.','.$out_trade_no.','.$total_fee.','.$refund_fee.','.$key)),200);
$weixinpay = null;
//return;
}
}
}
$this->binding_model->cancelEvent($event_id);
$this->booking_model->updateStateByEventId($event_id, $state);
$result=true;
$result = $this->event_model->updateStateById($event_id, $state);
if($result==true){
echo json_encode(array('status' => true, 'value' => $booking), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get the member status
*/
public function getMemberState()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{"user_id"};
$role = $book->{'role'};
$result = $this->member_state_model->getMemberState($user_id);
$result1 = $this->user_model->getBasicData($user_id, $role);
if($result1!=null){
echo json_encode(array('status' => true, 'result' => $result, 'result1'=> $result1), 200);
} else {
echo json_encode(array('status' => false, 'result' => 0), 200);
}
}

/*
* this function is used to get the information of favourite site
*/
public function getFavouriteSite()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$result = $this->user_model->getFavouriteSite($user_id);
if($result !=null){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to delete site which had been favourite
*/
public function cancelFavouriteSite()
{
$book = json_decode(file_get_contents("php://input"));
$boss_id = $book->{'boss_id'};
$user_id = $book->{'user_id'};
$result = $this->user_model->cancelFavouriteSite($user_id, $boss_id);
if($result){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get the information of the site
*/
public function getSiteDetail()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$boss_id = $book->{'boss_id'};
$site = $this->boss_model->getSiteDetail($boss_id, $user_id);
$picture = $this->boss_model->getSitePictures($boss_id);
$isFavourite = $this->boss_model->isFavourite($user_id, $boss_id);
$event = $this->event_model->getEventByUser($boss_id, 0);
if($site !=null){
echo json_encode(array('status' => true, 'site' => $site, 'picture' => $picture, 'isFavourite' => $isFavourite, 'event' => $event), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get rating of the site
*/
public function getRatingCountBySite()
{
$book = json_decode(file_get_contents("php://input"));
$boss_id = $book->{'boss_id'};
$result = $this->rating_model->getRatingCountByBoss($boss_id);
if($result !=null){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get rating of the site
*/
public function getRatingByEvent()
{
$book = json_decode(file_get_contents("php://input"));
$event_id = $book->{'event_id'};
$result = $this->rating_model->getRatingByEvent($event_id);
if($result !=null){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get rating of the site
*/
public function getRatingBySite()
{
$book = json_decode(file_get_contents("php://input"));
$boss_id = $book->{'boss_id'};
$result = $this->rating_model->getRatingByBoss($boss_id);
if($result !=null){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to register individual user
*/
public function registerUser()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$info['role'] = $book->{'role'};
$info['name'] = $book->{'name'};
$info['phone'] = $book->{'phone'};
$info['reg_time'] = date("Y-m-d H:i:s");
if($info['role']==1){
$info['state'] = 1;
}
else{
$info['state'] = 2;
}
$alarm['type'] = 0;
$alarm['user_id'] = $user_id;
$alarm['submit_time'] = date("Y-m-d H:i:s");
$this->alarm_admin_model->addAlarm($alarm);
$result = $this->user_model->registerUser($user_id, $info);
if($result>0){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to register boss
*/
public function registerBoss()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$boss['boss_id'] = $user_id;
$info['role'] = $book->{'role'};
$info['name'] = $book->{'name'};
$info['phone'] = $book->{'phone'};
$info['state'] = 1;
$info['reg_time'] = date("Y-m-d H:i:s");
$boss['site_name'] = $book->{'site_name'};
$boss['province'] = $book->{'province'};
$boss['city'] = $book->{'city'};
$boss['area'] = $book->{'area'};
$boss['detail_address'] = $book->{'detail_address'};
$boss['id_no'] = $book->{'id_no'};
$boss['longitude'] = $book->{'longitude'};
$boss['latitude'] = $book->{'latitude'};
$alarm['type'] = 0;
$alarm['user_id'] = $user_id;
$alarm['submit_time'] = date("Y-m-d H:i:s");
$this->alarm_admin_model->addAlarm($alarm);
$result = $this->boss_model->addNewBoss($boss, $user_id);
$result = $this->user_model->registerUser($user_id, $info);
if(true){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add license image of user
*/
public function addAllowPic()
{
$user_id = $this->input->post('user_id');
$info['allow_pic'] = $this->image_upload();
$result = $this->user_model->addAllowPic($user_id, $info);
if(count($result)>0){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add license image of user
*/
public function addIDPic1()
{
$user_id = $this->input->post('user_id');
$info['id_pic1'] = $this->image_upload();
$result = $this->user_model->addIDPic($user_id, $info);
if(count($result)>0){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add license image of user
*/
public function addIDPic2()
{
$user_id = $this->input->post('user_id');
$info['id_pic2'] = $this->image_upload();
$result = $this->user_model->addIDPic($user_id, $info);
if(count($result)>0){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get the address where current user can accept the goods
*/
public function addAcceptAddress()
{
$book = json_decode(file_get_contents("php://input"));
$result = $this->accept_address_model->addAddressByUser($book);
if($result){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get the address where current user can accept the goods
*/
public function getAcceptAddress()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$result = $this->accept_address_model->getAddressByUser($user_id);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to change the address where current user can accept the goods
*/
public function changeAcceptAddress()
{
$book = json_decode(file_get_contents("php://input"));
$address_id = $book->{'address_id'};
$info['user_id'] = $book->{'user_id'};
$info['name'] = $book->{'name'};
$info['province'] = $book->{'province'};
$info['city'] = $book->{'city'};
$info['area'] = $book->{'area'};
$info['detail_address'] = $book->{'detail_address'};
$info['phone'] = $book->{'phone'};
$info['email'] = $book->{'email'};
$result = $this->accept_address_model->changeAddressById($address_id, $info);
if($result){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to mark the address as the actual address where current user can accept the goods
*/
public function checkAcceptAddress()
{
$book = json_decode(file_get_contents("php://input"));
$address_id = $book->{'address_id'};
$user_id = $book->{'user_id'};
$result = $this->accept_address_model->checkAddressById($address_id, $user_id);
if($result>0){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to delete address where current user can accept the goods
*/
public function deleteAcceptAddress()
{
$book = json_decode(file_get_contents("php://input"));
$address_id = $book->{'address_id'};
$user_id = $book->{'user_id'};
$result = $this->accept_address_model->deleteAddressById($address_id, $user_id);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get the status of site whether or not user input information
*/
public function getSiteStatus()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$result = $this->boss_model->getSiteStatus($user_id);
$picture = $this->boss_model->getSitePictures($user_id);
if($result){
echo json_encode(array('status' => true, 'result'=> $result, 'picture' => $picture), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add the information of site which tells other users introduction and the service of the site
*/
public function addSiteInfo()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$info['site_type'] = $book->{'site_type'};
$info['site_introduction'] = $book->{'introduction'};
$info['site_service'] = $book->{'service'};
$result = $this->boss_model->addSiteInfo($user_id, $info);
if($result == true){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add the information of site which tells other users introduction and the service of the site
*/
public function addSitePicture()
{
$user_id = $this->input->post('user_id');
$imageUrl = $this->image_upload();
$result = $this->boss_model->addSitePicture($user_id, $imageUrl);
if($result == true){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add the information of site which tells other users introduction and the service of the site
*/
public function addSitePictureURL()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$imageUrl = $book->{'image'};
$result = $this->db->query("insert site_picture(picture, boss_id) value('".$imageUrl."',".$user_id.")");
if($result!=null){
echo json_encode(array('status' => true, 'user_id' => $user_id, 'imageUrl' => $imageUrl), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to edit the information of site which tells other users introduction and the service of the site
*/
public function editSiteInfo()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$info['site_type'] = $book->{'site_type'};
$info['site_introduction'] = $book->{'introduction'};
$info['site_service'] = $book->{'service'};
$result = $this->boss_model->editSiteInfo($user_id, $info);
if($result == true){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

public function editSiteInfo1()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$info['site_type'] = $book->{'site_type'};
$info['site_introduction'] = $book->{'introduction'};
$info['site_service'] = $book->{'service'};
$result = $this->boss_model->editSiteInfo($user_id, $info);
if($result == true){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to create the event
*/
public function addEvent()
{
$event['organizer_id'] = $this->input->post('user_id');
$user_role = $this->input->post('role');
$event['name'] = $this->input->post('event_name');
$event['type'] = $this->input->post('event_type');
$event['start_time'] = $this->input->post('start_time');
$event['end_time'] = $this->input->post('end_time');
$event['province'] = $this->input->post('province');
$event['area'] = $this->input->post('area');
$event['city'] = $this->input->post('city');
$event['detail_address'] = $this->input->post('detail_address');
$event['longitude'] = $this->input->post('longitude');
$event['latitude'] = $this->input->post('latitude');
$event['limit'] = $this->input->post('limit');
$event['cost'] = $this->input->post('cost');
$event['comment'] = $this->input->post('comment');
$event['publicity'] = $this->input->post('publicity');
$event['reg_time'] = date("Y-m-d H:i:s");
$event['agent_name'] = $this->input->post('agent_name');
$event['agent_phone'] = $this->input->post('agent_phone');
$member_state = $this->input->post('member_state');
$event['pic'] =$this->image_upload();
if($user_role==2 && $event['publicity']==1)
{
$event['additional'] = $this->input->post('additional');
}
if($user_role==1){
$position = $this->db->query("select longitude, latitude from boss where boss_id=".$event['organizer_id'])->result();
$event['longitude'] = $position[0]->longitude;
$event['latitude'] = $position[0]->latitude;
}
$result = $this->event_model->addEvent($user_role, $event, $member_state);
if($result){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

public function getOpenid()
{
$book = json_decode(file_get_contents("php://input"));
$code = $book->{'code'};//获取code
$weixin =  file_get_contents("https://api.weixin.qq.com/sns/jscode2session?appid=wxea381fb0ca7c2a24&secret=a6209bae994c009eaad5f8da083617af&js_code=".$code."&grant_type=authorization_code");//通过code换取网页授权access_token
$jsondecode = json_decode($weixin); //对JSON格式的字符串进行编码
$array = get_object_vars($jsondecode);//转换成数组
$openid = $array['openid'];//输出openid
echo json_encode(array('status' => true,'openid' => $openid, 'session_key' => $array['session_key']), 200);
}

/*
* this function is used for set member state
*/
public function setMember()
{
$book = json_decode(file_get_contents("php://input"));  
$out_trade_no = $book->{'out_trade_no'}; 
$total_fee = $book->{'total_fee'};   
$user_id = $book->{'user_id'};
$result = $this->member_state_model->setMemberState($user_id, $total_fee, $out_trade_no);
echo json_encode(array('status' => true, 'result' => $result), 200);
}

/*
* this function is used for set todayfirst information of user
*/
public function setTodayFirst()
{
$book = json_decode(file_get_contents("php://input"));  
$today_first = $book->{'todayfirst'}; 
$user_id = $book->{'user_id'}; 
$honey = $book->{'honey'};
$this->db->query('update user set todayfirst='.$today_first.', daily_honey="[0,0]" where no='.$user_id);
$this->honey_model->addBackyard($user_id, $honey);
return;
}

/*
* this function is used for payment
*/
public function pay()
{
include 'WxPay.php';

$book = json_decode(file_get_contents("php://input"));  
$appid='wxea381fb0ca7c2a24';  
$mch_id='1500220062';  
$key='fengtiWeixin17642518820android12';  
$out_trade_no = $book->{'out_trade_no'}; 
$openid=$book->{'id'}; 
$total_fee = $book->{'fee'};   
$user_id = $book->{'user_id'}; 
if(empty($total_fee)) //押金  
{  
$body = "充值押金";  
$total_fee = floatval(99*100);  
}  
else {  
$body = "充值余额";  
$total_fee = floatval($total_fee*100);  
}  
$weixinpay = new WeixinPay($appid,$openid,$mch_id,$key,$out_trade_no,$body,$total_fee);  
$return=$weixinpay->pay();  
echo json_encode($return); 
}

/*
* this function is used for refund
*/
public function refund()
{
include 'WinxinRefund.php';
$book = json_decode(file_get_contents("php://input"));  
$appid='wxea381fb0ca7c2a24';  
$openid= $book->{'id'};  
$mch_id='1500220062';  
$key='fengtiWeixin17642518820android12';  
$out_refund_no = $book->{'out_refund_no'}; 
$out_trade_no = $book->{'out_trade_no'}; 
$total_fee = $book->{'fee'};
if(empty($total_fee)) //押金  
{  
$body = "退款押金";  
$total_fee = floatval(99*100);  
}  
else {  
$body = "退款余额";  
$total_fee = floatval($total_fee*100);  
}  //$openid,$outTradeNo,$totalFee,$outRefundNo,$refundFee
$refund_fee = $total_fee;
$weixinpay = new WinXinRefund($appid,$mch_id,$openid,$out_trade_no,$total_fee,$out_refund_no, $refund_fee, $key);
$return=$weixinpay->refund();  

echo json_encode($return); 
}

public function notify()
{
function post_data(){
$receipt = $_REQUEST;
if($receipt==null){
$receipt = file_get_contents("php://input");
if($receipt == null){
$receipt = $GLOBALS['HTTP_RAW_POST_DATA'];
}
}
return $receipt;
}

$post = post_data();    //接受POST数据XML个数

$post_data = $this->xml_to_array($post);   //微信支付成功，返回回调地址url的数据：XML转数组Array
$postSign = $post_data['sign'];
unset($post_data['sign']);

/* 微信官方提醒：
*  商户系统对于支付结果通知的内容一定要做【签名验证】,
*  并校验返回的【订单金额是否与商户侧的订单金额】一致，
*  防止数据泄漏导致出现“假通知”，造成资金损失。
*/
ksort($post_data);// 对数据进行排序
$str = $this->ToUrlParams($post_data);//对数组数据拼接成key=value字符串
$user_sign = strtoupper(md5($post_data));   //再次生成签名，与$postSign比较

$where['crsNo'] = $post_data['out_trade_no'];
$order_status = M('home_order','xxf_witkey_')->where($where)->find();

if($post_data['return_code']=='SUCCESS'&&$postSign){
/*
* 首先判断，订单是否已经更新为ok，因为微信会总共发送8次回调确认
* 其次，订单已经为ok的，直接返回SUCCESS
* 最后，订单没有为ok的，更新状态为ok，返回SUCCESS
*/
if($order_status['order_status']=='ok'){
$this->return_success();
}else{
$updata['order_status'] = 'ok';
if(M('home_order','xxf_witkey_')->where($where)->save($updata)){
$this->return_success();
}
}
}else{
echo '微信支付失败';
}
}

/*
* 给微信发送确认订单金额和签名正确，SUCCESS信息 -xzz0521
*/
private function return_success(){
$return['return_code'] = 'SUCCESS';
$return['return_msg'] = 'OK';
$xml_post = '<xml>
<return_code>'.$return['return_code'].'</return_code>
<return_msg>'.$return['return_msg'].'</return_msg>
</xml>';
echo $xml_post;
exit;
}

/*
* this function is used to get provinces
*/
public function getProvinces()
{
$query = $this->db->query("select id, province from provinces");
$result = $query->result();
if(count($result)>0){
echo json_encode(array('status' => true, 'result'=>$result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get cities
*/
public function getCities()
{
$book = json_decode(file_get_contents("php://input"));
$province = $book->{'province'};
$query = $this->db->query("select cities.id, cities.city from cities, provinces where provinces.provinceid=cities.provinceid and provinces.province='".$province."'");
$result = $query->result();
if(count($result)>0){
echo json_encode(array('status' => true, 'result'=>$result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get area
*/
public function getAreas()
{
$book = json_decode(file_get_contents("php://input"));
$city = $book->{'city'};
$province = $book->{'province'};
$query = $this->db->query("select areas.id, areas.area from provinces, cities, areas 
where provinces.provinceid = cities.provinceid and cities.cityid=areas.cityid and cities.city='".$city."' and provinces.province='".$province."'");
$result = $query->result();
if(count($result)>0){
echo json_encode(array('status' => true, 'result'=>$result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get area
*/
public function getAreas1()
{
$book = json_decode(file_get_contents("php://input"));
$city = $book->{'city'};
$query = $this->db->query("select areas.id, areas.area from provinces, cities, areas 
where provinces.provinceid = cities.provinceid and cities.cityid=areas.cityid and cities.city='".$city."'");
$result = $query->result();
if(count($result)>0){
echo json_encode(array('status' => true, 'result'=>$result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get area
*/
public function getItemsOnMap()
{
$book = json_decode(file_get_contents("php://input"));
$longitude = $book->{'longitude'};
$latitude = $book->{'latitude'};
$site = $this->boss_model->getSiteByDistance($longitude, $latitude);
$event = $this->event_model->getEventByDistance($longitude, $latitude);
$honey = $this->honey_model->getHoneyByDistance($longitude, $latitude);
if(count($site)>0 || count($event)>0 || count($honey)>0){
echo json_encode(array('status' => true, 'site' => $site, 'event' => $event, 'honey' => $honey), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to subtract honey with the amount of user catch
*/
public function catchHoney()
{
$book = json_decode(file_get_contents("php://input"));
$no = $book->{'no'};
$amount = $book->{'amount'};
$user_id = $book->{'user_id'};
$honey = $book->{'honey'};
$daily_honey = $book->{'daily_honey'};
if($no!=0){
$result = $this->honey_model->catchHoney($no, $honey);
$result = $this->user_model->catchHoney($amount, $user_id, $daily_honey);
}
else{
    $backyard_no = $book->{'backyard_no'};
    $this->honey_model->catchBackyardHoney($backyard_no, $honey);
    $result = $this->user_model->catchHoney($amount, $user_id, $daily_honey);
}
if($result){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get list of goods
*/
public function getGoodsList()
{
$result = $this->goods_model->getGoodsList();
if(count($result)>0){
echo json_encode(array('status' => true,'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get information of good user selected
*/
public function getGoodDetail()
{
$book = json_decode(file_get_contents("php://input"));
$id = $book->{'id'};
$result = $this->goods_model->getGoodDetail($id);
if(count($result)>0){
echo json_encode(array('status' => true,'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get information of good and receiver address for exchange
*/
public function orderExchange()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$good_id = $book->{'good_id'};
$good = $this->goods_model->getGoodDetail($good_id);
$address = $this->accept_address_model->getMainAddress($user_id);
if(count($address)>0){
echo json_encode(array('status' => true,'good' => $good, 'address' => $address), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to save information of exchange
*/
public function setExchange()
{
$book = json_decode(file_get_contents("php://input"));
$info['user_id'] = $book->{'user_id'};
$info['good_id'] = $book->{'good_id'};
$info['comment'] = $book->{'comment'};
$info['address_no'] = $book->{'address_no'};
$info['submit_time'] = date("Y-m-d H:i:s");
$alarm['type'] = 2;
$alarm['user_id'] = $info['user_id'];
$alarm['good_id'] = $info['good_id'];
$alarm['submit_time'] = date("Y-m-d H:i:s");
$this->alarm_admin_model->addAlarm($alarm);
$honey = $this->user_model->subHoney($info['user_id'], $info['good_id']);
$result = $this->exchange_model->addExchange($info);
if($result>0){
echo json_encode(array('status' => true, 'honey' => $honey), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get all information of exchange
*/
public function getExchange()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$result = $this->exchange_model->getExchange($user_id);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get all information of exchange
*/
public function endExchange()
{
$book = json_decode(file_get_contents("php://input"));
$no = $book->{'no'};
$result = $this->exchange_model->endExchange($no);
if($result){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get information of an exchange by id
*/
public function getExchangeDetail()
{
$book = json_decode(file_get_contents("php://input"));
$exchange_id = $book->{'exchange_id'};
$user_id = $book->{'user_id'};
$result = $this->exchange_model->getExchangeDetail($exchange_id, $user_id);
if(count($result)>0){
echo json_encode(array('status' => true, 'result' => $result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get binding information of user
*/
public function getBinding()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$result = $this->binding_model->getBinding($user_id);
if(count($result) > 0){
echo json_encode(array('status' => true, 'result' =>$result), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add binding information of user
*/
public function addBinding()
{
$book = json_decode(file_get_contents("php://input"));
$user_id = $book->{'user_id'};
$info['receiver'] = $book->{'receiver'};
$info['credit_no'] = $book->{'credit_no'};
$info['id_no'] = $book->{'id_no'};
$info['bank_phone'] = $book->{'bank_phone'};
$info['bank'] = $book->{'bank'};
$alarm['user_id'] = $user_id;
$alarm['type'] = 1;
$alarm['submit_time'] = date("Y-m-d H:i:s");
$this->alarm_admin_model->addAlarm($alarm);
$result = $this->binding_model->addBinding($user_id, $info);
if($result> 0){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to add binding history of user
*/
public function addBindingHistory()
{
$book = json_decode(file_get_contents("php://input"));
$userId = $book->{'user_id'};
$info = $book->{'amount'};
$result = $this->binding_model->addBindingHistory($userId,$info);
if($result> 0){
echo json_encode(array('status' => true), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get binding history of user
*/
public function getPaymentHistory()
{
$book = json_decode(file_get_contents("php://input"));
$userId = $book->{'user_id'};
$payment = $this->binding_model->getPaymentHistory($userId);
if(count($payment)> 0){
echo json_encode(array('status' => true,'payment' => $payment), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get all information of rule
*/
public function getRules()
{
$rule = $this->rule_model->getRule();
if(count($rule)> 0){
echo json_encode(array('status' => true,'rule' => $rule), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get amount of new alarm
*/
public function getNewAlarm()
{
$book = json_decode(file_get_contents("php://input"));
$userId = $book->{'user_id'};
$news = $this->alarm_user_model->getNewAlarm($userId);
if($news> 0){
echo json_encode(array('status' => true,'news' => $news), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}
/*
* this function is used to get amount of new booking alarm
*/
public function getNewBookingAlarm()
{
$book = json_decode(file_get_contents("php://input"));
$userId = $book->{'user_id'};
$bookingNewsAmount = $this->alarm_user_model->getNewBookingAlarm($userId);
if(true){
echo json_encode(array('status' => true, 'bookingNewsAmount' => $bookingNewsAmount), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}

/*
* this function is used to get information of all alarm
*/
public function getAlarm()
{
$book = json_decode(file_get_contents("php://input"));
$userId = $book->{'user_id'};
$news = $this->alarm_user_model->getAlarm($userId);
if(count($news)> 0){
echo json_encode(array('status' => true,'news' => $news), 200);
} else {
echo json_encode(array('status' => false), 200);
}
}


/*
* this function is used to get distance between two points
*/
function distance($lat1, $lon1, $lat2, $lon2) {
$theta = $lon1 - $lon2;
$dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
$dist = acos($dist);
$dist = rad2deg($dist);
$miles = $dist * 60 * 1.1515;
return ($miles * 1.609344);
}

/** this function is used to deal special letters in nickname
*/
public function filter($str) {     
if($str){
$name = $str;
$name = preg_replace('/\xEE[\x80-\xBF][\x80-\xBF]|\xEF[\x81-\x83][\x80-\xBF]/', '', $name);
$name = preg_replace('/xE0[x80-x9F][x80-xBF]‘.‘|xED[xA0-xBF][x80-xBF]/S','?', $name);
$return = json_decode(preg_replace("#(\\\ud[0-9a-f]{3})#ie","",json_encode($name)));
if(!$return){
return $this->jsonName($return);
}
}else{
$return = '';
}    
return $return;

}

/*
* this function is used to upload image
*/
public function image_upload()
{
if(isset($_FILES['file']['name']))
{
$config['upload_path'] = './uploads/';
$config['allowed_types'] = '*';
$config['remove_spaces'] = true;
$config['max_size']             = 10000;
$config['encrypt_name'] =true;
$this->load->library('upload', $config);
if(!$this->upload->do_upload('file'))
{
return $this->upload->display_errors();
}
else
{
$book = $this->upload->data();
return $book["file_name"];
}
}
}

/*
* this function is used to merge image
*/
public function image_merge($site_icon, $boss_id)
{
$im_dest = $boss_id.'.png';
$config['image_library'] = 'gd2';
$config['source_image'] = "./uploads/".$site_icon;
$config['new_image'] = "./uploads/temp.png";
$config['create_thumb'] = FALSE;
$config['file_permissions'] = "0777";
$config['maintain_ratio'] = FALSE;
$config['width']         = "49";
$config['height']       = "36";

$this->load->library('image_lib', $config);

if(!$this->image_lib->resize()){
$this->image_lib->display_errors();
}
$this->image_lib->clear();
$config['image_library'] = 'gd2';
$config['source_image'] = './assets/images/Business@2x.png';
$config['new_image'] = 'uploads/'.$im_dest;
$config['wm_type'] = 'overlay';
$config['wm_opacity'] = '100';
$config['wm_vrt_alignment'] = 'top';
$config['wm_hor_alignment'] = 'left';
$config['wm_hor_offset'] = '11';
$config['wm_vrt_offset'] = '28';
$config['wm_overlay_path'] = "./uploads/temp.png";

$this->image_lib->initialize($config);

if(!$this->image_lib->watermark()){
$this->image_lib->display_errors();
}

return $im_dest;
}


}

/* End of file User_Manage.php */
/* Location: ./application/controllers/api/User_Manage.php */