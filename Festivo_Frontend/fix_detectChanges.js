const fs = require('fs');

// Fix prizereport.ts
let prizeTs = fs.readFileSync('src/app/Institution/prizereport/prizereport.ts', 'utf8');
if (!prizeTs.includes('ChangeDetectorRef')) {
  prizeTs = prizeTs.replace("import { Component, OnInit } from '@angular/core';", "import { Component, OnInit, ChangeDetectorRef } from '@angular/core';");
  prizeTs = prizeTs.replace("private fb: FormBuilder", "private fb: FormBuilder,\n    private cdr: ChangeDetectorRef");
  prizeTs = prizeTs.replace(/this\.processData\(\);\s*\}/g, 'this.processData();\n          this.cdr.detectChanges();\n        }');
  prizeTs = prizeTs.replace("this.loadPrizes();\n          }", "this.loadPrizes();\n            this.cdr.detectChanges();\n          }");
  prizeTs = prizeTs.replace(/error: \(err\) => console\.error\('Error fetching institution details:', err\)\s*\}\);/g, "error: (err) => {\n          console.error('Error fetching institution details:', err);\n          this.cdr.detectChanges();\n        }\n      });");
}

fs.writeFileSync('src/app/Institution/prizereport/prizereport.ts', prizeTs);

// Fix institutionmaster.ts
let instMasterTs = fs.readFileSync('src/app/Institution/institutionmaster/institutionmaster.ts', 'utf8');

// Insert detect changes to subscription
instMasterTs = instMasterTs.replace(/this\.subscriptionLoading = false;\s*\}/g, 'this.subscriptionLoading = false;\n        this.cdr.detectChanges();\n      }');
// Insert detect changes to institutionDetails success
instMasterTs = instMasterTs.replace(/this\.fetchSubscriptionPlan\(\);\s*\}\);/g, 'this.fetchSubscriptionPlan();\n            this.cdr.detectChanges();\n          });');
// Insert detect changes to errors
instMasterTs = instMasterTs.replace(/this\.institutionName = 'Institution';\s*\}/g, "this.institutionName = 'Institution';\n        this.cdr.detectChanges();\n      }");

fs.writeFileSync('src/app/Institution/institutionmaster/institutionmaster.ts', instMasterTs);
console.log('Change detection injected.');
