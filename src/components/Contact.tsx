@@ .. @@
 import React, { useState, useEffect, useRef } from 'react';
 import { memo, useCallback } from 'react';
 import { Mail, Phone, MapPin, Send, MessageCircle, Calendar, Sparkles } from 'lucide-react';
-import { contactService } from '../lib/supabase';
+import { contactService } from '../lib/sqlite';