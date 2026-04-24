const fs = require('fs');
const htmlFile = 'src/app/Admin/adminmaster/adminmaster.html';
const scssFile = 'src/app/Admin/adminmaster/adminmaster.scss';

const htmlContent = \<div class="admin-dashboard">
  <!-- Sidebar -->
  <aside class="sidebar" [class.active]="sidebarOpen">
    <div class="sidebar-header">
      <div class="logo"></div>
      <h2>Festivo Admin</h2>
      <button class="toggle-btn" (click)="sidebarOpen = !sidebarOpen">
        x
      </button>
    </div>
    
    <div class="nav-links">
      <ng-container *ngFor="let item of menuItems">
        <button class="nav-item submenu-toggle" (click)="toggleMenu(item)" [class.expanded]="item.expanded" style="width: 100%; border: none; text-align: left; background: transparent; cursor: pointer;">
          <i>{{ item.icon }}</i>
          <span>{{ item.label }}</span>
          <i style="margin-left: auto; margin-right: 0; font-size: 14px;">{{ item.expanded ? '?' : '?' }}</i>
        </button>
        
        <div class="nav-submenu" *ngIf="item.expanded">
          <a *ngFor="let sub of item.submenu" [routerLink]="sub.route" class="nav-item sub-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" style="cursor: pointer;">
            <i>{{ sub.icon }}</i>
            <span>{{ sub.label }}</span>
          </a>
        </div>
      </ng-container>
    </div>
    
    <div class="sidebar-footer">
      <a (click)="logout()" class="logout-btn" style="cursor: pointer;">
        <i>??</i>
        <span>Logout</span>
      </a>
    </div>
  </aside>

  <!-- Overlay -->
  <div class="sidebar-overlay" [class.active]="sidebarOpen" (click)="sidebarOpen = !sidebarOpen"></div>

  <!-- Main Content -->
  <main class="main-content">
    <header class="top-header">
      <div class="header-left">
        <button class="mobile-toggle" (click)="sidebarOpen = !sidebarOpen">
          ?
        </button>
        <h1 class="page-title">Festivo Admin <span>| Dashboard</span></h1>
      </div>
      
      <div class="header-right">
        <div class="notifications">
          <i>??</i>
          <span class="badge">0</span>
        </div>
        <div class="user-profile" (click)="toggleUserProfile()">
          <div style="background: rgba(255,255,255,0.1); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">??</div>
          <div class="user-info">
            <span class="user-name">{{ adminName }}</span>
            <span class="user-role">Super Admin</span>
          </div>
          <i>?</i>
        </div>
      </div>
    </header>
    
    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </main>
</div>\;

fs.writeFileSync(htmlFile, htmlContent);

let scssContent = fs.readFileSync(scssFile, 'utf8');

if (!scssContent.includes('.nav-submenu')) {
  // We need to inject .nav-submenu nested logic into .nav-links
  scssContent = scssContent.replace('.nav-item {', \.nav-submenu {
        margin-left: 12px;
        border-left: 1px solid \\\-glass;
        padding-left: 8px;
        margin-bottom: 8px;
        
        .sub-item {
          padding: 10px 16px;
          margin-bottom: 4px;
          font-size: 14px;
          
          i {
            font-size: 16px;
            margin-right: 12px;
          }
        }
      }
      
      .nav-item {\);
      
  scssContent = scssContent.replace(/\\\\\\\$/g, '$');
  fs.writeFileSync(scssFile, scssContent);
}

