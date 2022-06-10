/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Mocks
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { QRCodeGenerator } from "@dhealth/qr-library";

// creates an *object* QR Code with fake
// key-value content, mainnet and empty generation hash
export const mockObjectQR = QRCodeGenerator.createExportObject(
  { test: "value" },
  104,
  "empty"
);

// Base64 representation of the above QR Code
// @link {mockObjectQR}
export const mockObjectQRBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQ" +
  "YyAAAAAklEQVR4AewaftIAAAd6SURBVO3BQW4sy7LgQDKg/W+ZfYY+SiBRJf37ot3M/mGtSxzWushhrYsc1rrIYa2LHNa6" +
  "yGGtixzWushhrYsc1rrIYa2LHNa6yGGtixzWushhrYsc1rrIDx9S+UsVb6i8UTGpTBWTylQxqUwVn1D5RMUbKn+p4hOHtS" +
  "5yWOsih7Uu8sOXVXyTyjdVTCpvqEwVk8obKlPFpDJVTCpTxaQyqUwVb1R8k8o3Hda6yGGtixzWusgPv0zljYo3VKaKb6p4" +
  "o2JSeUPlicobFb9J5Y2K33RY6yKHtS5yWOsiP/x/RmWqeEPljYpJZap4ovKkYlKZKiaVqeImh7UucljrIoe1LvLDZVSeVD" +
  "xReVIxqTxReUNlqvimipsd1rrIYa2LHNa6yA+/rOIvVTxRmSqmiicqb1S8UfGbVKaKT1T8lxzWushhrYsc1rrID1+m8l+i" +
  "MlVMKlPFpDJVTCpTxaQyVUwqU8WkMlVMKlPFpDJVTCpTxROV/7LDWhc5rHWRw1oX+eFDFf/LKiaVNyomlU+oTBWTyhsVn6" +
  "j4X3JY6yKHtS5yWOsiP3xIZaqYVL6pYqqYVKaKSeWNiicqU8UTlScVk8qTiknljYonKt9U8ZsOa13ksNZFDmtd5IcvU5kq" +
  "JpWpYlKZKiaVqeKJylTxRGVSeVLxROU3qUwVk8pU8UbFGypTxaQyVXzTYa2LHNa6yGGti9g/fEBlqphU3qiYVKaKT6g8qX" +
  "ii8omKSeVJxROVJxWTyicqJpVvqvjEYa2LHNa6yGGti9g//CGVNyp+k8qTikllqviEyjdVPFGZKp6oTBX/ZYe1LnJY6yKH" +
  "tS5i//CLVKaKSWWqmFSmiknlExWTyhsVk8pUMalMFU9UpopJ5X9JxaQyVXzisNZFDmtd5LDWRX74MpU3Kp5UTCpTxROVqe" +
  "ITFZPKVDGpvKEyVUwqU8WkMlW8oTJVTCpTxScqvumw1kUOa13ksNZFfviyikllUpkqnqhMFZ9QmSqmikllUvlExZOKSWWq" +
  "mFTeUJkq3qiYVN6omFSmik8c1rrIYa2LHNa6iP3DB1SmijdUporfpDJVTCpTxaQyVXxC5UnFpPKkYlKZKt5QmSqeqEwVf+" +
  "mw1kUOa13ksNZFfvgylaliUpkqnqi8UTGpfFPFGypTxZOKSWWqmFQmlaniN6k8UZkqftNhrYsc1rrIYa2L/PDHKiaVqWKq" +
  "mFSmit+k8omKSeWJylQxqXyTylQxVTyp+C85rHWRw1oXOax1EfuH/zCVqeITKlPFpPKk4g2VqeKJypOKSeUTFW+oTBWfUJ" +
  "kqPnFY6yKHtS5yWOsiP3xIZaqYVKaKJypTxRsqf0llqniiMlU8qXhS8YbKpPJGxaQyVTxRmSq+6bDWRQ5rXeSw1kXsH75I" +
  "Zar4hMpU8QmVNyreUJkqnqhMFZ9Q+U0Vk8obFb/psNZFDmtd5LDWRewfPqAyVUwqTyreUJkqnqhMFd+k8omKSWWqmFSmim" +
  "9SmSreUJkqJpWp4psOa13ksNZFDmtd5Ic/VjGpTBWTylTxRGWqeKIyVTxReaPimyqeqEwVk8pUMVVMKlPFGypTxaQyVXzi" +
  "sNZFDmtd5LDWRewf/g+pPKl4Q+VJxaQyVUwqU8Wk8kbFE5U3Kv6SyhsVf+mw1kUOa13ksNZFfviQypOKT6h8ouJJxTdVfK" +
  "JiUnlD5f9SxaQyVUwqU8UnDmtd5LDWRQ5rXeSHP6byRsUTlW9SmSomlaniicqTikllqphUnlRMKlPFpDJVPFGZKt5QmSq+" +
  "6bDWRQ5rXeSw1kV++LKKJxWTyhOVJxVPVKaKb1KZKp5UTCpTxZOKT6i8oTJVvFExqUwqU8UnDmtd5LDWRQ5rXeSHP6YyVb" +
  "yhMqlMFVPFpPKk4o2KJxVvqEwVk8qTijcq3lCZKt6omFS+6bDWRQ5rXeSw1kV++GUqU8WkMlVMKlPFpPJNKlPFE5UnFW9U" +
  "PKmYVCaVN1Q+oTJVTCpPKr7psNZFDmtd5LDWRewf/oepvFExqUwVk8obFZPKk4onKk8qnqi8UfGGyhsVv+mw1kUOa13ksN" +
  "ZFfviQyl+qmComlU+oTBWTylTxRsWk8kbFJyomlScqU8U3qUwVnzisdZHDWhc5rHWRH76s4ptUnqhMFZPKk4pJZVKZKiaV" +
  "qWKqeFIxqUwVk8pU8aRiUnmj4hMVf+mw1kUOa13ksNZFfvhlKm9UfFPFpDJVTBWTypOKJypTxZOKSWWqeKLyCZVPVEwqf+" +
  "mw1kUOa13ksNZFfriMylQxVbxRMam8UTGpPKl4ojJVTBWfUHlSMalMKlPFE5VvOqx1kcNaFzmsdZEfLlMxqXyiYqp4Q2Wq" +
  "mFSeVHxCZap4UvFGxaTyROU3Hda6yGGtixzWusgPv6ziN1V8U8UbKlPFVPGGylTxiYpJ5TdVPKmYVL7psNZFDmtd5LDWRX" +
  "74MpW/pPJNKk8qpopJZap4o+ITKk8q3lCZKt5Q+UuHtS5yWOsih7UuYv+w1iUOa13ksNZFDmtd5LDWRQ5rXeSw1kUOa13k" +
  "sNZFDmtd5LDWRQ5rXeSw1kUOa13ksNZFDmtd5P8B5UP/TDyEyPsAAAAASUVORK5CYII=";
