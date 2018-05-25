<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            规则管理
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="container">
                <form action="<?php echo base_url().'saveRule';?>" method="POST">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th style="width: 5vw;">序号</th>
                            <th>规则说明</th>
                            <th>数据</th>
                        </tr>
                        </thead>
                            <tr>
                                <td>1</td>
                                <td>场馆主创建一次活动，每一个用户报名，可产生蜂蜜数</td>
                                <td><input type="text" name="rule0" value="<?php echo $rule[0]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>个人发起活动，如果活动显示在地图上，每一个用户报名，可产生蜂蜜数</td>
                                <td><input type="text" name="rule1" value="<?php echo $rule[1]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>地图上，每一罐蜂蜜可采集的次数，单次采蜜量随机
</td>
                                <td><input type="text" name="rule2" value="<?php echo $rule[2]->value;?>"/>&nbsp;&nbsp;次</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>步数转化成蜂蜜</td>
                                <td>1步=&nbsp;<input type="text" name="rule3" value="<?php echo $rule[3]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>每参加一次活动，地图上和后花园产蜜的比例</td>
                                <td><input type="text" name="rule4" value="<?php echo $rule[4]->value;?>"/>&nbsp;&nbsp;:&nbsp;&nbsp;<input type="text" name="rule" value="1"/></td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>用户在地图采集蜂蜜的上限</td>
                                <td><input type="text" name="rule5" value="<?php echo $rule[5]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>用户在后花园采集蜂蜜的上限</td>
                                <td><input type="text" name="rule6" value="<?php echo $rule[6]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>会员资费</td>
                                <td><input type="text" name="rule7" value="<?php echo $rule[7]->value;?>"/>&nbsp;&nbsp;元/月</td>
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>个人创建活动需要显示在地图上，花费蜂蜜数</td>
                                <td><input type="text" name="rule8" value="<?php echo $rule[8]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                    </table>
                </div>
                <input class="btn btn-primary" type="submit" value="保存"/>
            </form>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
</script>
