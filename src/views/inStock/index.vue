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
          <el-form-item label="所属人">
            <el-select
              v-model="query.owner"
              placeholder="请选择所属人"
              clearable
            >
              <el-option
                v-for="(item, index) in ownerOptions"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类型">
            <el-select v-model="query.genre" placeholder="请选择类型" clearable>
              <el-option
                v-for="(item, index) in genreOptions"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleAdd" style="margin-left: 30px"
            >新 增</el-button
          >
          <el-button type="primary" @click="reset" style="margin-left: 30px"
            >重 置</el-button
          >
          <el-button type="primary" @click="init" style="margin-left: 30px"
            >刷 新</el-button
          >
        </el-col>
      </el-row>
      <el-row style="display: flex; justify-content: right; margin-right: 50px">
        <el-upload
          action="/api/upload"
          :file-list="fileList"
          :show-file-list="false"
          accept=".xlsx"
          :on-success="handleSuccess"
          :headers="{ Authorization: token }"
        >
          <el-button type="primary">导 入</el-button>
        </el-upload>
        <el-button type="primary" @click="exportExcel" style="margin-left: 30px"
          >导 出</el-button
        >
        <el-button
          type="danger"
          @click="handleDelete"
          style="margin-left: 30px"
          >批量删除</el-button
        >
      </el-row>
    </el-form>
    <el-table
      ref="table"
      :data="tableData"
      @selection-change="handleSelectionChange"
      height="650"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" :index="indexMethod"> </el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width || 150"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: red"
            @click="handleDel(scope.row)"
            size="small"
            >删除</el-button
          >
          <el-button type="text" size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="handleSell(scope.row)"
            >出售</el-button
          >
        </template>
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
    <el-dialog title="编辑" :visible.sync="formBox" width="30%">
      <el-form
        :model="formData"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="型号" prop="type">
          <el-input v-model="formData.type"></el-input>
        </el-form-item>
        <el-form-item label="所属人" prop="owner">
          <el-select
            v-model="formData.owner"
            placeholder="请选择所属人"
            clearable
          >
            <el-option
              v-for="(item, index) in ownerOptions"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="genre">
          <el-select
            v-model="formData.genre"
            placeholder="请选择类型"
            clearable
          >
            <el-option
              v-for="(item, index) in genreOptions"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="买入价格" prop="purchasePrice">
          <el-input v-model="formData.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="总数量" prop="totalNum">
          <el-input v-model="formData.totalNum"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="2">
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="formBox = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="出售" :visible.sync="sellBox" width="30%">
      <el-form
        :model="sellData"
        :rules="rules"
        ref="sellForm"
        label-width="100px"
      >
        <el-form-item label="型号" prop="type">
          <el-input v-model="sellData.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="总数量" prop="totalNum">
          <el-input v-model="sellData.totalNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="已出售" prop="sellNum">
          <el-input v-model="sellData.sellNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="num">
          <el-input v-model="sellData.num" disabled></el-input>
        </el-form-item>
        <el-form-item label="出售价格" prop="sellPrice">
          <el-input v-model="sellData.sellPrice"></el-input>
        </el-form-item>
        <el-form-item label="卖出数量" prop="sell">
          <el-input v-model="sellData.sell"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark2">
          <el-input v-model="sellData.remark2" type="textarea" :rows="2">
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="sellBox = false">取 消</el-button>
        <el-button type="primary" @click="submitSell">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addGoods,
  getGoods,
  updateGoods,
  delGoods,
  exportExcel,
  delArrayGoods,
  sellGoods
} from "@/api/storehouse.js";
import { getConfiguration } from "@/api/configuration.js";

export default {
  data() {
    return {
      sellBox: false,
      multipleSelection: [],
      token: sessionStorage.getItem("token"),
      fileList: [],
      query: {
        type: undefined,
        owner: undefined,
        genre: undefined,
      },
      ownerOptions: [
        { label: "创明" },
        { label: "创新" },
        { label: "创发" },
        { label: "创文" },
        { label: "自己" },
      ],
      genreOptions: [{ label: "原装" }, { label: "翻新" }],
      tableColumn: [
        {
          prop: "type",
          label: "型号",
        },
        {
          prop: "owner",
          label: "所属人",
        },
        {
          prop: "genre",
          label: "类型",
        },
        {
          prop: "num",
          label: "库存数量",
        },
        {
          prop: "purchasePrice",
          label: "买入价格",
        },
        {
          prop: "sellNum",
          label: "卖出数量",
        },
        {
          prop: "totalNum",
          label: "总数量",
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      tableData: [],
      formBox: false,
      formData: {
        type: "a1",
        owner: "自己",
        genre: "翻新",
        purchasePrice: 10,
        sellNum: 100,
        totalNum: 1000,
        remark: "测试",
      },
      sellData: {
        type: "",
        sellPrice: "",
        sellNum: "",
        remark: "",
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
      formStatus: 0,
      pagination: {
        limit: 10,
        total: 0,
        page: 1,
      },
    };
  },
  created() {
    getConfiguration({ type: 0 }).then((res) => {
      this.ownerOptions = res.data;
    });
    getConfiguration({ type: 1 }).then((res) => {
      this.genreOptions = res.data;
    });
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
    exportExcel() {
      exportExcel()
        .then((res) => {
          console.log(res);
          window.open(res.url);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    init() {
      const query = { ...this.query, ...this.pagination };
      getGoods(query).then((res) => {
        this.tableData = res.data;
        this.pagination = res.pagination;
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        });
      });
    },
    handleDel(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", `删除${row.type}`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delGoods({ id: row._id }).then((res) => {
            this.$message.success(res.msg);
            this.init();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleDelete() {
      if (!this.multipleSelection.length) {
        return this.$message.warning("请先选择数据");
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", `批量删除`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const ids = [];
          this.multipleSelection.forEach((item) => {
            ids.push(item._id);
          });
          delArrayGoods({ ids: ids }).then((res) => {
            this.$message.success(res.msg);
            this.init();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleAdd() {
      this.formData = this.$options.data().formData;
      this.formStatus = 0;
      this.formBox = true;
    },
    handleEdit(row) {
      this.formData = row;
      this.formStatus = 1;
      this.formBox = true;
    },
    handleSell(row) {
      this.sellData = row;
      this.formStatus = 1;
      this.sellBox = true;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const fn = this.formStatus === 0 ? addGoods : updateGoods;
          fn(this.formData).then((res) => {
            this.$message.success(res.msg);
            this.init();
            this.formBox = false;
          });
        } else {
          return false;
        }
      });
    },
    submitSell() {
      this.$refs.sellForm.validate((valid) => {
        if (valid) {
          sellGoods(this.sellData).then((res) => {
            this.$message.success(res.msg);
            this.init();
            this.sellBox = false;
          });
        } else {
          return false;
        }
      });
    },
    handleSuccess(res, file) {
      this.$message.success(res.msg);
      this.init();
    },
    reset() {
      this.query = this.$options.data().query;
    },
    indexMethod(index) {
      return index + this.pagination.limit * (this.pagination.page - 1) + 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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

