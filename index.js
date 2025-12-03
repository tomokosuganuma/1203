var express = require("express");
var router = express.Router();

const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// メインページ
router.get("/", async function (req, res, next) {
  const blogs = await prisma.blog.findMany({
    orderBy: { date: "desc" }
  });

  res.render("index", { blogs: blogs });
});

// 新規ブログ追加
router.post("/add", async function (req, res, next) {
  try {
    const { title, date, content } = req.body;

    await prisma.blog.create({
      data: {
        title,
        date: new Date(date),
        content,
      },
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding blog");
  }
});

// キーワード検索
router.post("/search", async function (req, res, next) {
  const keyword = req.body.keyword;

  const results = await prisma.blog.findMany({
    where: {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } }
      ]
    },
    orderBy: { date: "desc" }
  });

  res.render("search", {
    keyword: keyword,
    results: results,
  });
});

module.exports = router;
