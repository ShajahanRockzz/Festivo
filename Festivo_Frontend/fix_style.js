const fs = require('fs');
const path = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/myregistrations/myregistrations.scss';
let scss = fs.readFileSync(path, 'utf8');

const replacement = `  // Search and Filter Bar Styles
  .filter-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
      flex-wrap: wrap;

      .search-box {
          flex: 2;
          min-width: 250px;
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          &:focus-within {
              border-color: #0ea5e9;
              background: rgba(15, 23, 42, 0.8);
              box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
          }

          .search-icon {
              color: #94a3b8;
              font-size: 1.1rem;
              pointer-events: none;
              padding-left: 16px;
              margin-right: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
          }

          .search-input {
              flex: 1;
              width: 100%;
              background: transparent;
              border: none;
              color: #f8fafc;
              padding: 14px 16px 14px 0;
              font-size: 0.95rem;

              &::placeholder {
                  color: #64748b;
              }

              &:focus {
                  outline: none;
              }
          }
      }

      .filter-box {
          flex: 1;
          min-width: 200px;
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          &:focus-within {
              border-color: #0ea5e9;
              background-color: rgba(15, 23, 42, 0.8);
              box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
          }

          .filter-icon {
              color: #94a3b8;
              font-size: 1.1rem;
              pointer-events: none;
              padding-left: 16px;
              margin-right: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
          }

          .filter-select {
              flex: 1;
              width: 100%;
              appearance: none;
              background: transparent;
              border: none;
              color: #f8fafc;
              padding: 14px 40px 14px 0;
              font-size: 0.95rem;
              cursor: pointer;

              /* Custom dropdown arrow using background image */
              background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
              background-repeat: no-repeat;
              background-position: right 16px center;
              background-size: 16px;

              &:focus {
                  outline: none;
              }

              option {
                  background-color: #0f172a;
                  color: #f8fafc;
                  padding: 12px;
              }
          }
      }
  }

  .empty-filter`;

scss = scss.replace(/\.filter-bar\s*\{[\s\S]*?\.empty-filter/, replacement);
fs.writeFileSync(path, scss);
console.log('Fixed');
