@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Mail, MailOpen, Search, Filter, Trash2, Eye, Calendar, User, MessageCircle, AlertCircle } from 'lucide-react';
-import { contactService, ContactMessage } from '../../lib/supabase';
+import { contactService } from '../../lib/sqlite';
+import { ContactMessage } from '../../lib/database';

export default React