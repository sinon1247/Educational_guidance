import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t-[0.5px] border-border mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg text-foreground mb-1">Educational Guidance</p>
          <p className="font-body text-xs text-muted-foreground">
            ระบบข้อมูลโรงเรียนเพื่อการแนะแนว
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-xs font-body text-muted-foreground">
          <a href="mailto:contact@guidanceportal.edu" className="hover:text-accent transition-colors duration-300">
            ติดต่อ
          </a>
          <a href="mailto:support@guidanceportal.edu" className="hover:text-accent transition-colors duration-300">
            สนับสนุน
          </a>
          <span>© {new Date().getFullYear()} All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
