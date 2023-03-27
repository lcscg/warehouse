<template>
  <div class="app-container">
    <el-form label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="型号">
            <el-input
              placeholder="请输入型号"
              v-model="query.type"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="reset" style="margin-left: 30px"
            >重 置</el-button
          >
          <el-button type="primary" @click="init" style="margin-left: 30px"
            >刷 新</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <el-table ref="table" :data="tableData" height="650">
      <el-table-column type="index" :index="indexMethod"> </el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pagination.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getSell } from "@/api/storehouse.js";
import moment from "moment";

export default {
  data() {
    return {
      query: {
        type: undefined,
      },
      tableColumn: [
        {
          prop: "type",
          label: "型号",
        },
        {
          prop: "purchasePrice",
          label: "买入价格",
        },
        {
          prop: "sellPrice",
          label: "卖出价格",
        },
        {
          prop: "sellNum",
          label: "卖出数量",
        },
        {
          prop: "createTime",
          label: "卖出时间",
          width: 250,
          formatter: (val) => {
            return moment(val.createTime).format("YYYY-MM-DD HH:mm:ss");
          },
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      tableData: [],

      pagination: {
        limit: 10,
        total: 0,
        page: 1,
      },
    };
  },
  created() {
    this.init();
  },
  watch: {
    query: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.init();
    },
    init() {
      const query = { ...this.query, ...this.pagination };
      getSell(query).then((res) => {
        this.tableData = res.data;
        this.pagination = res.pagination;
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        });
      });
    },
    reset() {
      this.query = this.$options.data().query;
    },
    indexMethod(index) {
      return index + this.pagination.limit * (this.pagination.page - 1) + 1;
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
.el-pagination {
  text-align: right;
}
</style>

