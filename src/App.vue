<template>
    <Row type="flex" justify="center">
        <Col span="16">
            <Divider>账单列表</Divider>
            <div class="filter-area">
                <div class="date-picker">
                    时间筛选：
                    <DatePicker type="daterange" show-week-numbers placeholder="选择日期"
                                v-model="dateVal"></DatePicker>
                </div>

                <Button type="primary" size="small" @click.stop="showModal=true">添加账单</Button>
            </div>

            <Table border :columns="columns" :data="data">
            </Table>
        </Col>
        <Modal
                v-model="showModal"
                title="添加新账单"
                @on-ok="addBill"
                @on-cancel="showModal=false">
            <div class="form-group">
                账单类型：
                <RadioGroup v-model="newBill.type">
                    <Radio label="收入"></Radio>
                    <Radio label="支出"></Radio>
                </RadioGroup>
            </div>
            <div class="form-group">
                账单分类：
                <Select v-model="newBill.category">
                    <Option v-for="(item,key) in options" :value="item.id" :key="key">{{item.label}}</Option>
                </Select>
            </div>
            <div class="form-group">
                账单金额：
                <Input v-model="newBill.amount" type="number" placeholder="请输入账单金额"/>
            </div>
        </Modal>
    </Row>
</template>

<script>
    import {
        Row,
        Col,
        Table,
        DatePicker,
        Divider,
        Button,
        Modal,
        Input,
        Radio,
        RadioGroup,
        Select,
        Option,
    } from "view-design"


    export default {
        name: "App",
        components: {
            RadioGroup,
            Radio,
            Input,
            Modal,
            Button,
            Table,
            Row,
            Col,
            DatePicker,
            Divider,
            Select,
            Option
        },
        data() {
            return {
                columns: [
                    {title: "账单时间", key: "time", align: "center"},
                    {title: "账单类型", key: "type_cn", align: "center"},
                    {
                        title: "账单分类", key: "category_cn", align: "center",
                        filters: [],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            return row.category === value
                        }
                    },
                    {
                        title: "账单金额", key: "amount_format", align: "center", sortable: true,
                        sortMethod(a, b, type) {
                            const A = +a.replace(/[￥,]/g, "");
                            const B = +b.replace(/[￥,]/g, "");
                            return type === "asc" ? A - B : B - A;
                        }
                    }
                ],
                options: [
                    {id: "1bcddudhmh", value: 0, label: "车贷"},
                    {id: "hc5g66kviq", value: 0, label: "车辆保养"},
                    {id: "8s0p77c323", value: 0, label: "房贷"},
                    {id: "0fnhbcle6hg", value: 0, label: "房屋租赁"},
                    {id: "odrjk823mj8", value: 0, label: "家庭用品"},
                    {id: "bsn20th0k2o", value: 0, label: "交通"},
                    {id: "j1h1nohhmmo", value: 0, label: "旅游"},
                    {id: "3tqndrjqgrg", value: 0, label: "日常饮食"},
                    {id: "s73ijpispio", value: 1, label: "工资"},
                    {id: "1vjj47vpd28", value: 1, label: "股票投资"},
                    {id: "5il79e11628", value: 1, label: "基金投资"}
                ],
                showModal: false,
                data: [],
                dateVal: null,
                newBill: {
                    type: "",
                    category: "",
                    amount: ""
                },
                count: ""
            }
        },
        watch: {
            dateVal(val) {
                this.acc(val)
            }
        },
        created() {
            this.init()
        },
        mounted() {
            this.$nextTick(() => {
                this.options.map(item => {
                    this.columns.filter(v => v.key === 'category_cn')[0].filters.push({
                        label: item.label,
                        value: item.id
                    })
                })
            })
        },
        methods: {
            addBill() {
                axios.post("http://localhost:3333/addBill", this.newBill).then(res => {
                    this.$Message[res.status !== 200 || !res.data.success ? "error" : "success"](res.data.message)
                    this.init();
                })
            },
            init() {
                axios.get("http://localhost:3333/getList").then(res => {
                    if (res.status === 200) {
                        const {data, success} = res.data;
                        this.data = success ? Object.freeze(data) : [];
                        localStorage.setItem("bill", JSON.stringify(data))
                    }
                }).catch(() => {
                    this.$Message.error("系统繁忙，请重试!");
                    this.data = []
                })
            },
            acc(val) {
                //获取原始数据
                const DATA = JSON.parse(localStorage.getItem("bill"));
                //计算总和
                const total = () => {
                    const sum = (type = "1") => this.data.filter(v => v.type === type).map(v => v.amount).reduce((prev, cur) => prev + cur, 0);
                    const detail = {};
                    //支出明细统计
                    const Group = this.groupBy(this.data.filter(v => v.type === "0"), item => item.category_cn);
                    Group.map(item => {
                        detail[item[0].category_cn] = item.map(v => v.amount).reduce((prev, cur) => prev + cur, 0)
                    });
                    let desc = `<div class="detail"><p>收入总额：<em>${sum()}</em><br>支出总额：<em>${sum("0")}</em></p><h5 class="detail-title">支出明细：</h5>`;
                    Object.entries(detail).map(v => {
                        desc += `<p>${v[0]}：<em>${v[1]}</em></p>`
                    });
                    return desc + "</div>"
                };

                if (val.every(v => v === '')) {
                    this.data = DATA;
                    this.$Notice.open({
                        title: "全部",
                        desc: total()
                    });
                } else {
                    const GetTime = time => new Date(time).getTime();
                    this.data = DATA.filter(v => GetTime(v.time) >= GetTime(val[0]) && GetTime(v.time) <= GetTime(val[1]))
                    this.$Notice.open({
                        title: `${new Date(val[0]).toLocaleDateString()}-${new Date(val[1]).toLocaleDateString()}`,
                        desc: total()
                    });
                }

            },
            groupBy(array, f) {
                let groups = {};
                array.forEach(function (o) {
                    let group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            }
        }
    }
</script>

<style>
    .filter-area {
        display: flex;
        justify-content: space-between;
        padding: 16px 0;
        align-items: center;
    }

    .form-group {
        margin-bottom: 16px;
    }

    .detail-title {
        margin: 16px 0 10px;
    }

    em {
        font-style: normal;
        color: #2d8cf0;
    }
</style>