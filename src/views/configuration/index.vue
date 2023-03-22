<template>
  <div class="app-container">
    <el-button type="primary" @click="$status(0, '所属人')">所属人</el-button>
    <el-button type="primary" @click="$status(1, '类型')">类型</el-button>

    <el-dialog :title="title" :visible.sync="status" width="30%">
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        class="demo-dynamic"
      >
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.label'"
          :rules="{
            required: true,
            message: '配置项不能为空',
            trigger: 'blur',
          }"
        >
          <el-row>
            <el-col :span="18">
              <el-input v-model="domain.label"></el-input
            ></el-col>
            <el-col :span="5" :offset="1">
              <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="status = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateConfiguration, getConfiguration } from "@/api/configuration.js";

export default {
  data() {
    return {
      ownerOptions: [
        { label: "创明" },
        { label: "创新" },
        { label: "创发" },
        { label: "创文" },
        { label: "自己" },
      ],
      genreOptions: [{ label: "原装" }, { label: "翻新" }],
      status: false,
      type: 0,
      title: "",
      dynamicValidateForm: {
        domains: [
          {
            label: "",
          },
        ],
      },
    };
  },
  methods: {
    $status(val, title) {
      this.title = title;
      this.type = val;
      getConfiguration({ type: val }).then((res) => {
        this.dynamicValidateForm.domains = res.data;
        this.status = true;
      });
    },
    submit() {
      const params = {
        type: this.type,
        data: this.dynamicValidateForm.domains,
      };
      updateConfiguration(params).then((res) => {
        this.$message.success(res.msg);
        this.status = false;
      });
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now(),
      });
    },
  },
};
</script>

  
  <style scoped>
</style>
  
  