<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            提现列表
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url(); ?>bindingListingByFilter" method="POST" id="searchList">
                        <div class="col-xs-12 col-sm-4 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchStatus" name="searchStatus">
                                    <option value="0"<?php if ($searchStatus == 0) echo ' selected'; ?>>认证手机号</option>
                                    <option value="1"<?php if ($searchStatus == 1) echo ' selected'; ?>>申请人</option>
                                    <option value="2"<?php if ($searchStatus == 2) echo ' selected'; ?>>持卡人</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <input type="text" id="searchName" name="searchName"
                                       value="<?php echo $searchText == 'all' ? '' : $searchText; ?>"
                                       class="form-control"/>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchState" name="searchState">
                                    <option value="10"<?php if ($searchState == 10) echo ' selected'; ?>>状态</option>
                                    <option value="0"<?php if ($searchState == 0) echo ' selected'; ?>>提现中</option>
                                    <option value="1"<?php if ($searchState == 1) echo ' selected'; ?>>提现成功</option>
                                    <option value="2"<?php if ($searchState == 2) echo ' selected'; ?>>提现失败</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-4 form-inline">
                            <div class="form-group area-search-control-view">
                                <button class="btn btn-primary searchList"
                                        onclick="">查询
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th width="">认证手机号</th>
                            <th>申请人</th>
                            <th>持卡人</th>
                            <th>身份证号</th>
                            <th>银行卡号</th>
                            <th width="">银行预留手机号</th>
                            <th>申请金额</th>
                            <th>状态</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                       <?php
                        $state = array("提现中", "提现成功", "提现失败");
                        if (!empty($bindingList)) {
                            $i = 0;
                            foreach ($bindingList as $record) {
                                ?>
                                <tr>
                                    <td><?php echo $record->phone; ?></td>
                                    <td><?php echo $record->name; ?></td>
                                    <td><?php echo $record->receiver; ?></td>
                                    <td><?php echo $record->id_no; ?></td>
                                    <td><?php echo $record->credit_no; ?></td>
                                    <td><?php echo $record->bank_phone; ?></td>
                                    <td><?php echo $record->amount; ?></td>
                                    <td><?php echo $state[$record->state]; ?></td>
                                    <td class="text-center">
                                       <?php 
                                            if($record->state != 0){
                                        ?>
                                        <a href="<?php echo base_url().'bindingDetail/'.$record->no; ?>">
                                            查看 &nbsp;
                                        </a>
                                       <?php
                                            }
                                            else{
                                        ?>
                                        <a href="<?php echo base_url().'bindingConfirm/'.$record->no; ?>">
                                            打款 &nbsp;
                                        </a>
                                       <?php
                                            }
                                        ?>
                                    </td>
                                </tr>
                               <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                    <div class="clearfix">
                       <?php echo $this->pagination->create_links(); ?>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
</script>
