<template>
  <div id="app">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" :model="users" class="demo-form-inline">
        <el-form-item label="编号:">
          <el-input
            placeholder="请输入查询编号"
            v-model="id" type= number
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="品牌名称:">
          <el-input
            placeholder="请输入查询品牌名称"
            v-model="nameminche"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" icon="el-icon-search" @click="onSubmit" >查询</el-button>
          <el-button  type="success" icon="el-icon-circle-plus-outline"  @click="addshow = true">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="品牌名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="seq"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button  type="primary" icon="el-icon-edit" @click.prevent="queryuserbyid(scope.row)" size="mini" plain>编辑</el-button>
            <el-button  type="danger" icon="el-icon-delete" size="mini" plain @click.prevent="removeById(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageno" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>

    <!-- 编辑模态框-->
    <el-dialog title="编辑品牌" :visible="xiugaishow">
      <el-form label-width="80px" :modal="editform">
        <el-form-item label="id" >
          <el-input clearable disabled v-model="querybyid.id"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input clearable v-model="querybyid.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌首字母">
          <el-input clearable  v-model="querybyid.letter">

          </el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type= number  v-model="querybyid.seq">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="xiugaishow = false">取 消</el-button>
        <el-button type="primary" @click="xiugai">修改</el-button>
      </div>

    </el-dialog>

    <!-- 添加模态框-->
    <el-dialog title="新增品牌" :visible="addshow">
      <el-form label-width="80px" :modal="editform">
        <el-form-item label="品牌名字">
          <el-input clearable v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="品牌首字母">
          <el-input clearable  v-model="letter">
          </el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input clearable  type= number v-model="seq">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addshow = false">取 消</el-button>
        <el-button type="primary" @click="saveusers">添加</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        id: "",
        xiugaishow: false,
        addshow: false,
        tableData:[],
        addData:{},
        querybyid:[],
        pageno:1,
        pagesize:5,
        total:0,
        name: "",
        letter: "",
        seq: "",
        nameminche: ""
      }
    },
    methods:{
      getdata(){  //获取数据
        var params = new URLSearchParams();
        params.append("pageno",this.pageno);
        params.append("pagesize",this.pagesize);
        params.append("name",this.nameminche);
        params.append("id",this.id);

        this.$axios.post("/tbBrand/querytbBrand",params).then((response)=>{
          this.tableData=response.data.records;
          this.total=response.data.total;
        }).catch();

      },
      handleSizeChange(val){
        this.pagesize = val;
        this.getdata();
      },
      handleCurrentChange(val){
        this.pageno = val;
        this.getdata();
      },
      onSubmit(row){
        this.getdata();
      },
      queryuserbyid(row){
        this.xiugaishow=true;
        var params = new URLSearchParams();
        params.append("id",row.id);
        this.$axios.post("/tbBrand/getByIdbBrand",params).then((response)=>{
          this.querybyid=response.data;
        }).catch();
        this.getdata();
      },xiugai(){
        var _this=this
        this.xiugaishow=true;
        var params = new URLSearchParams();
        params.append("id", this.querybyid.id);
        params.append("name", this.querybyid.name);
        params.append("seq", this.querybyid.seq);
        this.$axios.post("/tbBrand/updateById",params).then((response)=>{
          if (response==false){
            _this.$message({
              message: '修改失败',
              type: 'warning'
            });
            this.xiugaishow=false;
            return false
          }else {
            _this.$message({
              message: '修改成功',
              type: 'warning'
            });
            this.xiugaishow=false;
            this.getdata();
          }
        }).catch();
        this.getdata();
      },
      saveusers(){ //添加
        var _this = this;
        var params = new URLSearchParams();
        params.append("name", this.name);
        params.append("seq", this.seq);
        this.$axios.post("/tbBrand/savetbBrand",params).then((response)=>{
          if (response.data == true) {
            _this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success'
            });
            _this.addshow=false;
            _this.pageno = 1;
            this.getdata();
          } else {
            _this.$notify({
              title: '失败',
              message: '添加失败',
              type: 'danger'
            });
          }
          _this.pageno = 1;
          _this.getdata();
        }).catch();
      },
      removeById(row) {  //根据id删除
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", row.id);
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/tbBrand/removeById",params).then(function (response) {
            _this.pageno = 1;
            _this.getdata();
          }).catch();
          _this.getdata();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    created(){
      this.getdata();
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
