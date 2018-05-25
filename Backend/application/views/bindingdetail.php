<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            提现详情
        </h1>
    </section>
    <section class="content">
        <div class="container">
            <div class="row custom-info-row">
                <label class="col-sm-2">提现账号:</label>
                <label class="col-sm-2" id="nickname"><?php echo $bindingDetail[0]->no; ?></label>
                <label class="col-sm-1" id="nickname" style="background-color: red; color:white;" align="center">
               <?php
                    $state = array("提现中", "提现成功", "提现失败");
                    echo $state[$bindingDetail[0]->state]; 
                ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">银行开户行:</label>
                <label class="col-sm-4" id="nickname"><?php echo $bindingDetail[0]->bank; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">持卡人</label>
                <label class="col-sm-4" id="nickname"><?php echo $bindingDetail[0]->name; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">身份证号:</label>
                <label class="col-sm-4" id="nickname"><?php echo $bindingDetail[0]->id_no; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">银行卡号:</label>
                <label class="col-sm-4" id="nickname"><?php echo $bindingDetail[0]->credit_no; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">银行预留手机号:</label>
                <label class="col-sm-4" id="nickname"><?php echo $bindingDetail[0]->bank_phone; ?>人</label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">申请金额:</label>
                <label class="col-sm-4" id="site_name"><?php echo $bindingDetail[0]->amount; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">申请时间:</label>
                <label class="col-sm-4" id="site_name"><?php echo $bindingDetail[0]->submit_time; ?></label>
            </div>
            <div id="tip" class="row custom-info-row">
                <label class="col-sm-2"> 备注:</label>
                <label class="col-sm-4" id="forbidden"><?php echo $bindingDetail[0]->comment; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">打款人:</label>  
                <label class="col-sm-2"><?php echo $bindingDetail[0]->receiver; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">打款时间:</label>
                <label class="col-sm-2"><?php echo $bindingDetail[0]->binding_time; ?></label>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-offset-2 custom-course-control-view">
                    <input type="button" class="btn btn-primary" onclick="location.href=baseURL+'binding';"
                           value="返回"/>
                </div>
            </div>
        </div>
    </section>
</div>
