"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Profile } from "@/types/data"; // Import Profile type
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Added imports
import { formatDateSafely } from "@/lib/utils"; // Import formatDateSafely

// Define UserProfileWithAuth type as it's used in UserManagementPage
interface UserProfileWithAuth extends Profile {
  email: string;
}

const formSchema = z.object({
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  phone_number: z.string().optional().<dyad-problem-report summary="666 problems">
<problem file="src/components/ProfilePage.tsx" line="104" column="6" code="17008">JSX element 'Card' has no corresponding closing tag.</problem>
<problem file="src/components/ProfilePage.tsx" line="114" column="8" code="17008">JSX element 'CardContent' has no corresponding closing tag.</problem>
<problem file="src/components/ProfilePage.tsx" line="129" column="61" code="1003">Identifier expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="129" column="74" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="142" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="150" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="271" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="288" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="296" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="334" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="130" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="138" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="259" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="276" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="284" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="322" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="102" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="193" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="201" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="322" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="331" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="333" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="49" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="57" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="178" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="195" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="203" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="241" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="130" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="138" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="259" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="276" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="284" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="322" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="130" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="138" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="259" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="276" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="284" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="322" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="182" column="395" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="182" column="397" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="182" column="442" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="182" column="444" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="184" column="407" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="184" column="409" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="184" column="446" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="184" column="448" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="56" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="69" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="247" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="249" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="254" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="282" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="284" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="95" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="108" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="286" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="288" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="293" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="189" column="395" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="189" column="397" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="189" column="442" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="189" column="444" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="191" column="407" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="191" column="409" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="191" column="446" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="191" column="448" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="56" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="69" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="247" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="249" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="254" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="282" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="284" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="95" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="108" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="286" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="288" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="293" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="102" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="231" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="239" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="360" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="369" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="371" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="49" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="57" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="178" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="195" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="203" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="241" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="202" column="395" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="202" column="397" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="202" column="442" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="202" column="444" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="204" column="407" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="204" column="409" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="204" column="446" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="204" column="448" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="56" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="69" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="247" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="249" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="254" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="282" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="284" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="95" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="108" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="286" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="288" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="293" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="209" column="395" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="209" column="397" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="209" column="442" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="209" column="444" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="211" column="407" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="211" column="409" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="211" column="446" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="211" column="448" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="56" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="69" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="247" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="249" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="254" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="282" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="284" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="95" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="108" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="286" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="288" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="293" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="102" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="231" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="239" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="360" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="369" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="371" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="49" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="57" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="178" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="195" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="203" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="241" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="222" column="395" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="222" column="397" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="222" column="442" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="222" column="444" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="224" column="407" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="224" column="409" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="224" column="446" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="224" column="448" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="56" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="69" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="247" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="249" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="254" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="282" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="284" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="95" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="108" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="286" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="288" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="293" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="229" column="395" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="229" column="397" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="229" column="442" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="229" column="444" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="231" column="407" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="231" column="409" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="231" column="446" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="231" column="448" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="56" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="69" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="247" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="249" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="254" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="282" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="284" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="95" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="108" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="286" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="288" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="293" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="102" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="193" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="201" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="322" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="331" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="333" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="49" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="57" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="178" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="195" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="203" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="241" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="190" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="204" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="380" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="389" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="391" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="280" column="146" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="280" column="160" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="280" column="336" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="281" column="142" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="281" column="156" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="281" column="332" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="282" column="142" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="282" column="156" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="282" column="332" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="283" column="146" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="283" column="160" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="283" column="336" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="284" column="146" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="284" column="160" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="284" column="336" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="285" column="148" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="285" column="162" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="285" column="338" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="286" column="147" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="286" column="161" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="286" column="337" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="287" column="148" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="287" column="162" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="287" column="338" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="289" column="148" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="289" column="162" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="289" column="338" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="290" column="139" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="290" column="153" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="290" column="329" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="295" column="3" code="17002">Expected corresponding JSX closing tag for 'div'.</problem>
<problem file="src/components/ProfilePage.tsx" line="358" column="2" code="17008">JSX element 'dyad-write' has no corresponding closing tag.</problem>
<problem file="src/components/ProfilePage.tsx" line="359" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="359" column="32" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="366" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="367" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="373" column="12" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="374" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="375" column="5" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="376" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="380" column="34" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="381" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="382" column="24" code="1005">'}' expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="383" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="386" column="5" code="1109">Expression expected.</problem>
<problem file="src/components/ProfilePage.tsx" line="387" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="389" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ProfilePage.tsx" line="389" column="3" code="1005">'&lt;/' expected.</problem>
<problem file="src/lib/utils.ts" line="13" column="11" code="2304">Cannot find name 'Locale'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="722" column="47" code="2304">Cannot find name 'addInvoiceMutation'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="723" column="18" code="2304">Cannot find name 'addInvoiceMutation'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="737" column="16" code="2552">Cannot find name 'AddInvoiceForm'. Did you mean 'EditInvoiceForm'?</problem>
<problem file="src/pages/InvoiceManagementPage.tsx" line="256" column="113" code="2304">Cannot find name 'getDocumentStatusBadgeClass'.</problem>
<problem file="src/components/ProfilePage.tsx" line="130" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="130" column="94" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="131" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="131" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="132" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="132" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="133" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="133" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="134" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="134" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="135" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="135" column="459" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="135" column="479" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="131" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="144" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="277" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="136" column="290" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="137" column="59" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="119" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="132" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="265" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="138" column="278" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="139" column="65" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="140" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="140" column="459" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="140" column="479" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="94" code="2304">Cannot find name 'onChange'.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="182" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="195" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="326" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="141" column="410" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="38" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="51" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="184" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="143" column="197" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="145" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="146" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="146" column="118" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="147" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="147" column="133" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="148" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="148" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="149" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="149" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="150" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="150" column="462" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="150" column="482" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="119" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="132" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="265" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="151" column="278" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="152" column="52" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="153" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="153" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="154" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="154" column="133" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="155" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="155" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="156" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="156" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="157" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="157" column="452" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="157" column="472" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="119" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="132" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="265" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="158" column="278" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="159" column="52" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="160" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="160" column="120" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="161" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="161" column="133" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="162" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="162" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="163" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="163" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="164" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="164" column="461" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="164" column="481" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="165" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="165" column="124" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="166" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="166" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="167" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="167" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="168" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="168" column="128" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="169" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="169" column="127" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="170" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="170" column="130" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="171" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="171" column="124" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="172" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="172" column="124" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="173" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="173" column="457" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="173" column="477" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="174" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="174" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="175" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="175" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="176" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="176" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="177" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="177" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="178" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="178" column="128" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="179" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="179" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="180" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="180" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="181" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="182" column="352" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="182" column="390" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="182" column="437" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="183" column="394" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="184" column="341" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="184" column="402" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="184" column="441" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="185" column="401" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="51" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="58" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="242" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="186" column="277" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="90" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="97" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="281" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="187" column="300" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="188" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="189" column="352" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="189" column="390" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="189" column="437" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="190" column="394" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="191" column="341" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="191" column="402" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="191" column="441" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="192" column="401" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="51" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="58" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="242" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="193" column="277" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="90" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="97" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="281" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="194" column="300" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="195" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="195" column="453" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="195" column="473" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="94" code="2304">Cannot find name 'readOnly'.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="220" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="233" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="196" column="364" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="38" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="51" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="184" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="198" column="197" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="200" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="201" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="202" column="352" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="202" column="390" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="202" column="437" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="203" column="394" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="204" column="341" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="204" column="402" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="204" column="441" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="205" column="401" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="51" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="58" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="242" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="206" column="277" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="90" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="97" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="281" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="207" column="300" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="208" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="209" column="352" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="209" column="390" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="209" column="437" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="210" column="394" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="211" column="341" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="211" column="402" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="211" column="441" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="212" column="401" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="51" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="58" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="242" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="213" column="277" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="90" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="97" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="281" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="214" column="300" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="215" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="215" column="458" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="215" column="478" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="94" code="2304">Cannot find name 'readOnly'.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="220" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="233" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="216" column="364" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="38" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="51" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="184" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="218" column="197" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="220" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="221" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="222" column="352" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="222" column="390" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="222" column="437" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="223" column="394" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="224" column="341" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="224" column="402" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="224" column="441" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="225" column="401" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="51" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="58" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="242" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="226" column="277" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="90" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="97" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="281" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="227" column="300" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="228" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="229" column="352" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="229" column="390" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="229" column="437" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="230" column="394" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="231" column="341" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="231" column="402" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="231" column="441" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="232" column="401" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="51" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="58" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="242" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="233" column="277" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="90" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="97" code="2304">Cannot find name 'InvoiceType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="281" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="234" column="300" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="235" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="235" column="456" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="235" column="517" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="94" code="2304">Cannot find name 'onChange'.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="182" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="195" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="326" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="236" column="410" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="38" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="51" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="184" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="238" column="197" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/ProfilePage.tsx" line="240" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="241" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="241" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="242" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="242" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="243" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="243" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="244" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="244" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="245" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="245" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="246" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="246" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="247" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="247" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="248" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="248" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="185" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="192" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="384" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ProfilePage.tsx" line="249" column="419" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="250" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="250" column="131" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="251" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="251" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="252" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="252" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="253" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="253" column="146" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="254" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="254" column="151" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="255" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="255" column="132" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="256" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="256" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="257" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="257" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="258" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="258" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="259" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="259" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="260" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="260" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="261" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="261" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="262" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="262" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="263" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="263" column="509" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="264" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="264" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="265" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="265" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="266" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="266" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="267" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="267" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="268" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="268" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="269" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="269" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="270" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="270" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="271" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="271" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="272" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="272" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="273" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="273" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="274" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="274" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="275" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="275" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="276" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="276" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="277" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="277" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="278" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="278" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="279" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="279" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="280" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="280" column="141" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="280" column="148" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="280" column="366" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="281" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="281" column="137" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="281" column="144" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="281" column="335" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="282" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="282" column="137" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="282" column="144" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="282" column="335" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="283" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="283" column="141" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="283" column="148" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="283" column="339" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="284" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="284" column="141" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="284" column="148" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="284" column="339" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="285" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="285" column="143" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="285" column="150" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="285" column="341" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="286" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="286" column="142" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="286" column="149" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="286" column="340" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="287" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="287" column="143" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="287" column="150" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="287" column="341" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="288" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="288" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="289" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="289" column="143" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="289" column="150" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="289" column="341" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="290" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="290" column="134" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="290" column="141" code="2304">Cannot find name 'ScheduleType'.</problem>
<problem file="src/components/ProfilePage.tsx" line="290" column="332" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="291" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="291" column="133" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="292" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="292" column="131" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="293" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="293" column="131" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="294" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="294" column="131" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="295" column="1" code="2339">Property 'dyad-problem-report' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="295" column="23" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="335" column="1" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="358" column="1" code="2339">Property 'dyad-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ProfilePage.tsx" line="359" column="10" code="2304">Cannot find name 'clsx'.</problem>
<problem file="src/components/ProfilePage.tsx" line="359" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ProfilePage.tsx" line="359" column="16" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ProfilePage.tsx" line="360" column="10" code="2304">Cannot find name 'twMerge'.</problem>
<problem file="src/components/ProfilePage.tsx" line="361" column="10" code="2552">Cannot find name 'format'. Did you mean 'FormData'?</problem>
<problem file="src/components/ProfilePage.tsx" line="361" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ProfilePage.tsx" line="361" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ProfilePage.tsx" line="361" column="18" code="2304">Cannot find name 'isValid'.</problem>
<problem file="src/components/ProfilePage.tsx" line="361" column="27" code="2304">Cannot find name 'parseISO'.</problem>
<problem file="src/components/ProfilePage.tsx" line="362" column="10" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/ProfilePage.tsx" line="362" column="16" code="2304">Cannot find name 'idLocale'.</problem>
<problem file="src/components/ProfilePage.tsx" line="363" column="15" code="2304">Cannot find name 'Locale'.</problem>
<problem file="src/components/ProfilePage.tsx" line="380" column="5" code="2304">Cannot find name 'dateObj'.</problem>
<problem file="src/components/ProfilePage.tsx" line="380" column="15" code="2304">Cannot find name 'parseISO'.</problem>
<problem file="src/components/ProfilePage.tsx" line="380" column="24" code="2304">Cannot find name 'dateInput'.</problem>
<problem file="src/components/ProfilePage.tsx" line="382" column="5" code="2304">Cannot find name 'dateObj'.</problem>
<problem file="src/components/ProfilePage.tsx" line="382" column="15" code="2304">Cannot find name 'dateInput'.</problem>
<problem file="src/components/ProfilePage.tsx" line="386" column="44" code="2304">Cannot find name 'locale'.</problem>
</dyad-problem-report>Tentu, mari kita perbaiki semua kesalahan TypeScript ini.

Kesalahan yang Anda lihat di `src/components/ProfilePage.tsx` (mulai dari `JSX element 'Card' has no corresponding closing tag` hingga `Cannot find name 'locale'`) menunjukkan bahwa ada blok `<dyad-problem-report>` dan `<dyad-write>` yang tidak sengaja disalin ke dalam file `ProfilePage.tsx` itu sendiri, bukan hanya sebagai bagian dari laporan kesalahan. Ini menyebabkan *parser* JSX bingung dan menghasilkan banyak kesalahan.

Selain itu, ada beberapa kesalahan `Cannot find name 'Locale'` dan `Cannot find name 'isValid'` yang menunjukkan bahwa impor `Locale` dan `isValid` di `src/lib/utils.ts` dan `src/components/TechnicianScheduleCalendar.tsx` belum sepenuhnya benar atau tidak dikenali.

Saya akan melakukan hal berikut:

1.  **Menghapus semua blok `<dyad-problem-report>` dan `<dyad-write>`** yang tidak sengaja disalin ke dalam `src/components/ProfilePage.tsx`.
2.  **Memastikan impor `Locale` dan `isValid` sudah benar** di `src/lib/utils.ts` dan `src/components/TechnicianScheduleCalendar.tsx`.

Berikut adalah perubahan yang akan saya terapkan:

<dyad-write path="src/lib/utils.ts" description="Memastikan impor Locale dan isValid sudah benar.">
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { Locale } from "date-fns"; // Pastikan ini diimpor dengan benar

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateSafely = (
  dateInput: string | Date | null | undefined,
  formatString: string = "dd MMMM yyyy",
  locale: Locale = idLocale
): string => {
  if (!dateInput) {
    return "-";
  }

  let dateObj: Date;
  if (typeof dateInput === 'string') {
    dateObj = parseISO(dateInput);
  } else {
    dateObj = dateInput;
  }

  if (isValid(dateObj)) {
    return format(dateObj, formatString, { locale });
  }
  return "-";
};