const fs=require('fs'); fs.writeFileSync('src/app/Admin/totalrevenue/totalrevenue.scss', \
.revenue-container {
  padding: 30px;
  background: var(--bg-midnight);
  color: var(--text-pure);
  min-height: 100vh;
  .header { margin-bottom: 30px; h1 { font-size: 28px; margin-bottom: 8px; color: var(--text-pure); } p { color: var(--text-slate); font-size: 14px; } }
  .summary-cards {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px;
    .card {
      background: var(--surface-slate); border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; border: 1px solid var(--border-subtle); transition: transform 0.3s ease;
      &:hover { transform: translateY(-5px); border-color: #6366f1; }
      .card-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; }
      &.total .card-icon { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
      &.sub .card-icon { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
      &.reg .card-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
      .card-info { h3 { margin: 0; font-size: 14px; color: var(--text-slate); text-transform: uppercase; letter-spacing: 0.5px; } h2 { margin: 8px 0 0; font-size: 28px; font-weight: 700; color: var(--text-pure); } }
    }
  }
  .charts-section {
    display: grid; grid-template-columns: 1fr 2fr; gap: 24px; margin-bottom: 40px;
    @media (max-width: 900px) { grid-template-columns: 1fr; }
    .chart-card {
      background: var(--surface-slate); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 24px;
      h3 { margin: 0 0 20px; color: var(--text-pure); font-size: 18px; }
      .chart-wrapper { position: relative; width: 100%; display: flex; justify-content: center; &.pie { height: 300px; } &.bar { height: 300px; } canvas { max-width: 100%; } }
    }
  }
  .history-table-container {
    background: var(--surface-slate); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 24px;
    h3 { margin: 0 0 20px; color: var(--text-pure); font-size: 18px; }
    .table-responsive { overflow-x: auto; }
    .styled-table {
      width: 100%; border-collapse: collapse;
      th, td { padding: 16px; text-align: left; border-bottom: 1px solid var(--border-subtle); }
      th { color: var(--text-slate); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; background: rgba(0, 0, 0, 0.2); }
      td { color: var(--text-pure); font-size: 14px; background: transparent; &.amount { font-weight: 600; color: #10b981; } }
      tbody tr { transition: background-color 0.2s ease; &:hover { background-color: rgba(255, 255, 255, 0.02); } }
      .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; &.subscription { background: rgba(99, 102, 241, 0.1); color: #818cf8; } &.registration { background: rgba(16, 185, 129, 0.1); color: #34d399; } }
      .text-center { text-align: center; color: var(--text-slate); padding: 30px; }
    }
  }
}
\);
