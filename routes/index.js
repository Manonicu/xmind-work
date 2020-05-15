const Papa = require("papaparse");
const fs = require("fs").promises;
const dayjs = require("dayjs");

const formatAmount = val => "￥" + val.toLocaleString("en-US", {minimumFractionDigits: 2});

module.exports = [
    {
        path: "/getList",
        method: "GET",
        handler: async () => {
            const data = [];
            try {
                const bill = await fs.readFile("./static/bill.csv");
                const categories = await fs.readFile("./static/categories.csv");
                const billReturnType = await Papa.parse(bill.toString());
                const categoriesReturnType = await Papa.parse(categories.toString());

                for await (let val of billReturnType.data.slice(1)) {
                    const filterArr = categoriesReturnType.data.filter(v => v[0] === val[2]);
                    data.push({
                        type_cn: val[0] === "1" ? "收入" : "支出",
                        type: val[0],
                        time: dayjs(+val[1]).format(),
                        category_cn: filterArr[0][2],
                        category: val[2],
                        amount_format: formatAmount(+val[3]),
                        amount: +val[3]
                    })
                }
                return {
                    success: true,
                    data
                }
            } catch (e) {
                return {
                    success: false,
                    data: []
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/{filename}',
        handler: {
            file: function (request) {
                return request.params.filename;
            }
        }
    },
    {
        path: "/addBill",
        method: "POST",
        handler: async req => {
            const {type, category, amount} = req.payload;
            const time = Date.now();
            try {
                const bill = await fs.readFile("./static/bill.csv");
                await fs.writeFile("./static/bill.csv", bill.toString() + "\n" + `${type === "收入" ? 1 : 0},${time},${category},${amount}`, "utf-8")
                return {
                    success: true,
                    message: "新增账单成功"
                }
            } catch (e) {
                return {
                    success: false,
                    message: "新增账单失败"
                }
            }
        }
    },
    {
        path: "/",
        method: "GET",
        handler: async (req, h) => {
            return h.view("index")
        }
    }
];