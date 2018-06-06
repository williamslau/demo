'use strict';
const BaseController = require('./base');
class CategoresCotroller extends BaseController {
  // get方法直接访问
  async index() {
    const { ctx } = this;
    let { pageNum = 1, pageSize = 5, keyWord } = ctx.request.query;
    // categories?pageNum=1&pageSize=5&keyword=a
    // http://localhost:7001/api/categories?pageNum=1&pageSize=2
    pageNum = isNaN(pageNum) ? 1 : parseInt(pageNum);
    pageSize = isNaN(pageSize) ? 5 : parseInt(pageSize);
    const query = {};
    if (keyWord) {
      query.name = new RegExp(keyWord);
    }
    try {
      // 查询，分页
      const category = await ctx.model.Category.find(query)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize);
      this.success({ category });
    } catch (error) {
      this.error(error);
    }
  }
  // 增加文章分类
  // post方法直接访问
  async create() {
    const { ctx } = this;
    const category = ctx.request.body;
    try {
      let doc = await ctx.model.Category.findOne(category);
      if (doc) {
        this.error('此分类已经存在');
      } else {
        doc = await ctx.model.Category.create(category);
        this.success('保存分类成功');
      }
    } catch (error) {
      this.error(error);
    }
  }
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;
    const category = ctx.request.body; // {name:new}
    try {
      await ctx.model.Category.findByIdAndUpdate(id, category);
      this.success('更新成功');
    } catch (error) {
      this.error(error);
    }
  }
  async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;
    try {
      await ctx.model.Category.findByIdAndRemove(id);
      this.success('删除成功');
    } catch (error) {
      this.error(error);
    }
  }
}
module.exports = CategoresCotroller;
