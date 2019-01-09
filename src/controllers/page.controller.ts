import { Request, Response, NextFunction } from "express";
import * as path from "path";
import { IPage } from "../interfaces";
import { PageNotFound } from "../errors";
import { pageService } from "../services";
const marked = require("marked");
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

export const pageController = {
    getPage: async (req: Request, res: Response, next: NextFunction) => {
        const routeWhitelist = [
            "repere-istorice",
            "elevi-de-prestigiu",
            "ziua-portilor-deschise",
            "planul-de-scolarizare",
            "circumscriptie",
            "criterii-specifice-de-departajare",
            "orarul-pentru-inscriere",
            "acte-necesare-pentru-inscriere",
            "procedura-de-repartizare-pe-clase",
            "scoala-dupa-scoala",
            "imagini-din-clase",
            "metodologie-evaluare-nationala",
            "calendar-evaluare-nationala",
            "rezultate-simulare-evaluare-nationala",
            "rezultate-evaluare-nationala",
            "personal-auxiliar",
            "comisii",
            "clase",
            "orar-elevi",
            "transfer-elevi",
            "rezultate-olimpiade",
            "burse-elevi",
            "revista-scolii",
            "eco-scoala",
            "biblioteca",
            "hotarari-ca",
            "achizitii-publice",
            "cheltuieli-asociatie-parinti",
            "rapoarte",
            "anunturi",
        ];

        const pageId = req.params.pageId;

        if (!routeWhitelist.includes(pageId)) {
            const err = new PageNotFound(`Pagina negasita: ${req.method} ${req.url}`);
            return next(err);
        }

        // const pageId = "5c3258b8b3a6dc56c06a6e7d";

        // const filePath = path.join(__dirname, "../public/test.md");

        // const page1Md = await readFileAsync(filePath, "utf-8");

        // const page1: IPage = {
        //     markdownContent: page1Md,
        //     htmlContent: marked(page1Md),
        // };

        // await pageService.insertOne(page1);

        // daca vrei sa editezi extern string-ul de markdown din mongo:
        // 1. copiezi sirul intr-un fisier (cu extensia md) din VSCode
        // 2. rulezi "Find and Replace din VSCode: Mondul regex, find=\\n, replace = \n
        // 3. dupa ce ai terminat de editat, refaci string-ul tot cu Find and Replace: \n -> \\n

        const page = await pageService.getOneBySlug(pageId);

        var data = {
            ctx: req.ctx,
            pageContent: (page && page.htmlContent) || "pagina negasita",
        };

        res.render("page", data);

        // fs.readFile(filePath, "utf-8", (err, pageContentMd) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }

        //     const page: IPage = {
        //         content: pageContentMd,
        //     };

        //     // await pageService.insertOne(page);

        //     const pageContentHtml = marked(pageContentMd);

        //     // console.log(pageContentHtml);

        //     var data = {
        //         ctx: req.ctx,
        //         pageContent: pageContentHtml,
        //     };

        //     res.render("page", data);
        // });
    },

    getPage2: async (req: Request, res: Response, next: NextFunction) => {
        const routeWhitelist = [
            "repere-istorice",
            "elevi-de-prestigiu",
            "ziua-portilor-deschise",
            "planul-de-scolarizare",
            "circumscriptie",
            "criterii-specifice-de-departajare",
            "orarul-pentru-inscriere",
            "acte-necesare-pentru-inscriere",
            "procedura-de-repartizare-pe-clase",
            "scoala-dupa-scoala",
            "imagini-din-clase",
            "metodologie-evaluare-nationala",
            "calendar-evaluare-nationala",
            "rezultate-simulare-evaluare-nationala",
            "rezultate-evaluare-nationala",
            "personal-auxiliar",
            "comisii",
            "clase",
            "orar-elevi",
            "transfer-elevi",
            "rezultate-olimpiade",
            "burse-elevi",
            "revista-scolii",
            "eco-scoala",
            "biblioteca",
            "hotarari-ca",
            "achizitii-publice",
            "cheltuieli-asociatie-parinti",
            "rapoarte",
            "anunturi",
        ];

        const pageId = req.params.pageId;

        if (!routeWhitelist.includes(pageId)) {
            const err = new PageNotFound(`Pagina negasita: ${req.method} ${req.url}`);
            return next(err);
        }

        // const pageId = "5c3258b8b3a6dc56c06a6e7d";

        const filePath = path.join(__dirname, `../public/pages/${pageId}.md`);

        const page1Md = await readFileAsync(filePath, "utf-8");

        // const page1: IPage = {
        //     markdownContent: page1Md,
        //     htmlContent: marked(page1Md),
        // };

        // await pageService.insertOne(page1);

        // daca vrei sa editezi extern string-ul de markdown din mongo:
        // 1. copiezi sirul intr-un fisier (cu extensia md) din VSCode
        // 2. rulezi "Find and Replace din VSCode: Mondul regex, find=\\n, replace = \n
        // 3. dupa ce ai terminat de editat, refaci string-ul tot cu Find and Replace: \n -> \\n

        const page: IPage = await pageService.getOneBySlug(pageId);

        page.markdownContent = page1Md;
        page.htmlContent = marked(page1Md);

        console.log(page);

        await pageService.updateOne(page);

        var data = {
            ctx: req.ctx,
            pageContent: (page && page.htmlContent) || "pagina negasita",
        };

        res.render("page", data);

        // fs.readFile(filePath, "utf-8", (err, pageContentMd) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }

        //     const page: IPage = {
        //         content: pageContentMd,
        //     };

        //     // await pageService.insertOne(page);

        //     const pageContentHtml = marked(pageContentMd);

        //     // console.log(pageContentHtml);

        //     var data = {
        //         ctx: req.ctx,
        //         pageContent: pageContentHtml,
        //     };

        //     res.render("page", data);
        // });
    },
};
