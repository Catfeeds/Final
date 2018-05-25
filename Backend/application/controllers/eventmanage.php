<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class eventmanage extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('event_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the event
     */
    public function index()
    {
        $sData = $this->session->userdata('event_infos');
        $searchType = 100;
        $searchName = '';
        $searchRole = 10;
        $searchState = 10;
        $searchStatus = null;
        $fromTime = '';
        $toTime = '';
        if ($sData) {
            $searchType = $sData['searchType'];
            $searchName = $sData['searchName'];
            $searchRole = $sData['searchRole'];
            $searchState = $sData['searchState'];
            $searchStatus = $sData['searchStatus'];
        }
        $this->eventCollectListing($searchStatus, $searchName, $searchType, $searchRole, $searchState);
    }

    /**
     * This function is used to load the event list
     */
    function eventCollectListing($searchStatus = null, $searchName = '', $searchType = 100, $searchRole = 10, $searchState = 10)
    {
        $this->global['pageTitle'] = "活动管理";
        if ($searchName == 'ALL') $searchName = '';
        $count = $this->event_model->eventListingCount($searchStatus, $searchName, $searchType, $searchRole, $searchState);
        $returns = $this->paginationCompress("eventmanage/", $count, 10);
        $data['eventList'] = $this->event_model->eventListing($searchStatus, $searchName, $searchType, $searchRole, $searchState, $returns['page'], $returns['segment']);
        $this->global['searchStatus'] = $searchStatus;
        $this->global['searchText'] = $searchName;
        $this->global['searchRole'] = $searchRole;
        $this->global['searchState'] = $searchState;
        $this->global['searchType'] = $searchType;
        $this->global['pageType'] = 'event';
        $this->loadViews("eventmanage", $this->global, $data, NULL);
    }

    /**
     * This function is used to load the event list by search
     */
    function eventListingByFilter()
    {
        $searchStatus = $this->input->post('searchStatus');
        $searchName = $this->input->post('searchName');
        $searchRole = $this->input->post('searchRole');
        $searchState = $this->input->post('searchState');
        $searchType = $this->input->post('searchType');
        $this->session->set_userdata('event_infos', array(
        'searchType'=>$searchType,
        'searchName'=>$searchName,
        'searchRole'=>$searchRole,
        'searchState'=>$searchState,
        'searchStatus'=>$searchStatus,
        ));
        $this->eventCollectListing($searchStatus, $searchName, $searchType, $searchRole, $searchState);
    }

    /**
     * This function is used to load the event list by search
     */
    function deleteEvent()
    {
        $eventId = $this->input->post('eventId');
        $result = $this->event_model->deleteEvent($eventId);
        if ($result) {
            $this->session->set_flashdata('success', '删除成功.');
            echo(json_encode(array('status' => TRUE)));
        } else {
            $this->session->set_flashdata('error', '删除失败.');
            echo(json_encode(array('status' => FALSE)));
        }
    }
/**
     * This function is used to show the detail of event with eventId
     */
    function showEventDetail($eventId)
    {
        $eventDetail = $this->event_model->getEventDetailById($eventId);
        $data['eventDetail'] = $eventDetail;

        $userId = $this->event_model->getOrganizerId($eventId);
        $this->load->model('user_model');
        $userRole = $this->user_model->getRoleById($userId[0]->organizer_id);
        if($userRole->role == 2){
            $this->load->model('member_state_model');
            $data['member_state'] = $this->member_state_model->getStateById($userId[0]->organizer_id);
        }
        $this->load->model('booking_model');
        $data['booking'] = $this->booking_model->getBookingDetailByEvent($eventId);
        $favourite = $this->db->query("select count(no) as favourite_amount from favourite_event where event_id=".$eventId)->result();
        $data['favourite_amount'] =  $favourite[0]->favourite_amount;
        $this->global['pageTitle'] = '活动详情';
        $this->loadViews("eventdetail", $this->global, $data, NULL);
    }
    
    function pageNotFound()
    {
        $this->global['pageTitle'] = '蜂体 : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file eventmanage.php */
/* Location: .application/controllers/eventmanage.php */


?>