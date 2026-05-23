const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const anchor = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>';
const p1 = c.indexOf(anchor);

if (p1 > -1) {
    // Find the end of the script block. We know it ends after let mathTimeout; ... } }
    // Let's find the closing </script> that comes after `let mathTimeout;`
    const mathTimeoutIdx = c.indexOf('let mathTimeout;', p1);
    const endScriptIdx = c.indexOf('</script>', mathTimeoutIdx);
    
    // So the block to delete is from p1 to endScriptIdx + 9
    const blockToDelete = c.substring(p1, endScriptIdx + 9);
    console.log('Deleting block of size:', blockToDelete.length);
    
    c = c.substring(0, p1) + c.substring(endScriptIdx + 9);
    
    fs.writeFileSync('index.html', c, 'utf8');
    console.log('✅ Successfully removed the first script block! Size is now: ' + c.length);
} else {
    console.log('❌ Could not find p1');
}
