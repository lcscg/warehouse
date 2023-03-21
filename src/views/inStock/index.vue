<template>
  <div class="app-container">
    <el-form label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="型号">
            <el-input
              placeholder="请输入型号"
              v-model="query.type"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="8">
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
      </el-row>
    </el-form>
    <el-table :data="tableData">
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width || 160"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDel(scope.row)" size="small"
            >删除</el-button
          >
          <el-button type="text" size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
        <el-form-item label="库存数量" prop="num">
          <el-input v-model="formData.num"></el-input>
        </el-form-item>
        <el-form-item label="买入价格" prop="purchasePrice">
          <el-input v-model="formData.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="卖出数量" prop="sellNum">
          <el-input v-model="formData.sellNum"></el-input>
        </el-form-item>
        <el-form-item label="卖出数量" prop="totalNum">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
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
          label: "卖出数量",
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      tableData: [],
      formBox: false,
      formData: {
        type: undefined,
        owner: undefined,
        genre: undefined,
        num: undefined,
        purchasePrice: undefined,
        sellNum: undefined,
        totalNum: undefined,
        remark: undefined,
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
    };
  },
  created() {
    getOwner().then((res) => {
      this.ownerOptions = res.data;
    });
    getGenre().then((res) => {
      this.genreOptions = res.data;
    });
    this.init();
  },
  watch: {
    query() {
      this.init();
    },
  },
  methods: {
    init() {
      getGoods(this.query).then((res) => {
        this.tableData = res.data;
      });
    },
    handleDel(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", `删除${row.type}`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delGoods(row.id).then((res) => {
            this.$message.success(res.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleEdit(row) {
      this.formData = row;
      this.formBox = true;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          updateGoods(this.formData).then((res) => {
            this.$message.success(res.msg);
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

